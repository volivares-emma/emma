"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/admin/data-table";
import { Award, Download, Calendar, Users } from "lucide-react";
import { createCertificatesColumns } from "./components/certificates-columns";
import { toast } from "sonner";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCertificates();
  }, [currentPage]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/certificates?page=${currentPage}&pageSize=${itemsPerPage}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCertificates(data.data || []);
      setTotalItems(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar los certificados");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async (certificate: any) => {
    try {
      const response = await fetch(`/api/certificates/${certificate.id}/download`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al descargar certificado");
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `certificate-${certificate.user.username}-${certificate.course.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success("Certificado descargado correctamente");
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast.error("Error al descargar el certificado");
    }
  };

  const handleRegenerateCertificate = async (certificate: any) => {
    try {
      const response = await fetch(`/api/certificates/${certificate.id}/regenerate`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al regenerar certificado");
      }

      toast.success("Certificado regenerado correctamente");
      fetchCertificates();
    } catch (error) {
      console.error("Error regenerating certificate:", error);
      toast.error("Error al regenerar el certificado");
    }
  };

  // Calculate stats
  const totalCertificates = totalItems;
  const issuedThisMonth = certificates.filter((cert: any) => {
    const issueDate = new Date(cert.issued_at);
    const now = new Date();
    return issueDate.getMonth() === now.getMonth() && issueDate.getFullYear() === now.getFullYear();
  }).length;

  const uniqueCourses = new Set(certificates.map((cert: any) => cert.course_id)).size;
  const uniqueUsers = new Set(certificates.map((cert: any) => cert.user_id)).size;

  const columns = createCertificatesColumns({
    onDownload: handleDownloadCertificate,
    onRegenerate: handleRegenerateCertificate,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Certificados</h1>
          <p className="text-muted-foreground">
            Gestiona y descarga certificados de finalización de cursos
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Certificados</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCertificates}</div>
            <p className="text-xs text-muted-foreground">
              certificados emitidos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Este Mes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{issuedThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              este mes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCourses}</div>
            <p className="text-xs text-muted-foreground">
              cursos únicos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Destinatarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">
              destinatarios únicos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Certificates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Certificados</CardTitle>
          <CardDescription>
            Todos los certificados emitidos en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-6 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={certificates}
              searchKey="user"
              searchPlaceholder="Buscar certificados..."
              pageCount={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}