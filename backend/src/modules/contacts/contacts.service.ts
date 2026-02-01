import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact, ContactStatus, Note } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = this.contactRepository.create(createContactDto);
    return await this.contactRepository.save(contact);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Contact[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.contactRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return { data, total, page, limit };
  }

  async findByStatus(status: ContactStatus): Promise<Contact[]> {
    return await this.contactRepository.find({
      where: { status },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Contact> {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return contact;
  }

  async update(
    id: number,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    const contact = await this.findOne(id);
    Object.assign(contact, updateContactDto);
    return await this.contactRepository.save(contact);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.contactRepository.softDelete(id);
  }

  // Notes methods
  async addNote(
    id: number,
    noteData: { text: string; created_by: number; created_by_name?: string },
  ): Promise<Note> {
    const contact = await this.findOne(id);
    const notes: Note[] = Array.isArray(contact.notes) ? contact.notes : [];
    const newNote: Note = {
      id: Date.now(),
      text: noteData.text,
      created_by: noteData.created_by,
      created_by_name: noteData.created_by_name,
      created_at: new Date().toISOString(),
    };
    contact.notes = [...notes, newNote];
    await this.contactRepository.save(contact);
    return newNote;
  }

  async getNotes(id: number): Promise<Note[]> {
    const contact = await this.findOne(id);
    const notes: Note[] = Array.isArray(contact.notes) ? contact.notes : [];
    return notes.map((note) => ({
      ...note,
      created_at: note.created_at || (note as any).createdAt,
      updated_at: note.updated_at || (note as any).updatedAt,
      created_by: note.created_by ?? (note as any).created_by,
      created_by_name:
        note.created_by_name || (note as any).createdBy || (note as any).created_by_name,
    }));
  }

  async updateNote(id: number, noteId: number, text: string): Promise<Note> {
    const contact = await this.findOne(id);
    const notes: Note[] = Array.isArray(contact.notes) ? contact.notes : [];
    const noteIndex = notes.findIndex((n) => n.id === noteId);
    if (noteIndex === -1) {
      throw new NotFoundException(`Note with ID ${noteId} not found`);
    }
    notes[noteIndex].text = text;
    notes[noteIndex].updated_at = new Date().toISOString();
    contact.notes = notes;
    await this.contactRepository.save(contact);
    return notes[noteIndex];
  }

  async deleteNote(id: number, noteId: number): Promise<void> {
    const contact = await this.findOne(id);
    const notes: Note[] = Array.isArray(contact.notes) ? contact.notes : [];
    contact.notes = notes.filter((n) => n.id !== noteId);
    await this.contactRepository.save(contact);
  }
}
