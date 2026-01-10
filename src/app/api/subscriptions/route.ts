import { NextRequest, NextResponse } from "next/server";
import { getPaginationParams } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import type {
  Subscription,
  SubscriptionListResponse,
  SubscriptionCreatePayload,
  SubscriptionResponse,
} from "@/types/subscription";

// GET: paginado simple
export async function GET(request: NextRequest) {
  try {
    const { page, pageSize, skip } = getPaginationParams(request.url);

    const [subscriptionsDb, total] = await Promise.all([
      prisma.tbl_subscriptions.findMany({ skip, take: pageSize }),
      prisma.tbl_subscriptions.count(),
    ]);

    const subscriptions: Subscription[] = subscriptionsDb.map((s: any) => ({
      id: s.id,
      email: s.email,
      type: s.type,
      status: s.status,
      source: s.source,
      metadata: s.metadata ?? null,
      subscribedAt: s.subscribed_at,
      unsubscribedAt: s.unsubscribed_at,
      createdAt: s.created_at,
      updatedAt: s.updated_at,
      deletedAt: s.deleted_at,
    }));

    const response: SubscriptionListResponse = {
      data: subscriptions,
      page,
      pageSize,
      total,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("GET /subscriptions error:", err);
    return NextResponse.json(
      { error: "Error al obtener suscripciones" },
      { status: 500 }
    );
  }
}

// POST: crear suscripción solo con JSON
export async function POST(request: NextRequest) {
  try {

    const payload: SubscriptionCreatePayload = await request.json();

    if (!payload.email) {
      return NextResponse.json(
        { error: "El email es obligatorio" },
        { status: 400 }
      );
    }

    const created = await prisma.tbl_subscriptions.create({
      data: {
        email: payload.email,
        type: payload.type ?? "general",
        status: payload.status ?? "active",
        source: payload.source ?? null,
        metadata: payload.metadata ?? undefined,
      },
    });

    const subscription: SubscriptionResponse = {
      id: created.id,
      email: created.email,
      type: created.type,
      status: created.status,
      source: created.source,
      metadata: created.metadata ? JSON.parse(JSON.stringify(created.metadata)) : null,
      subscribedAt: created.subscribed_at,
      unsubscribedAt: created.unsubscribed_at,
      createdAt: created.created_at,
      updatedAt: created.updated_at,
    };

    return NextResponse.json(subscription, { status: 201 });
  } catch (err: any) {
    console.error("POST /subscriptions error:", err);
    return NextResponse.json(
      { error: err.message || "Error al crear suscripción" },
      { status: 500 }
    );
  }
}
