"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Download, Plus, Search, Upload, Trash2, Edit, Star, Phone, Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Dialog } from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { Contact, db_operations } from "@/lib/db";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ContactsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadContacts();
  }, [searchTerm]);

  const loadContacts = () => {
    const results = db_operations.getContacts(searchTerm);
    setContacts(results);
  };

  const handleExport = () => {
    const contactsStr = JSON.stringify(contacts, null, 2);
    const blob = new Blob([contactsStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contacts.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Dışa Aktarma Başarılı",
      description: "Kişileriniz başarıyla dışa aktarıldı.",
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const importedContacts = JSON.parse(content);
          
          if (Array.isArray(importedContacts)) {
            importedContacts.forEach(contact => {
              if (!contact.id) {
                db_operations.createContact(contact);
              }
            });
            
            loadContacts();
            toast({
              title: "İçe Aktarma Başarılı",
              description: "Kişileriniz başarıyla içe aktarıldı.",
            });
          }
        } catch (error) {
          toast({
            title: "Hata",
            description: "Geçersiz dosya formatı.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (data: Contact) => {
    if (selectedContact?.id) {
      await db_operations.updateContact(selectedContact.id, data);
    } else {
      await db_operations.createContact(data);
    }
    loadContacts();
  };

  const handleDelete = async () => {
    if (selectedContact?.id) {
      await db_operations.deleteContact(selectedContact.id);
      setIsDeleteDialogOpen(false);
      loadContacts();
      toast({
        title: "Başarılı",
        description: "Kişi başarıyla silindi.",
      });
    }
  };

  const toggleFavorite = async (id: number) => {
    await db_operations.toggleFavorite(id);
    loadContacts();
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Telefon Rehberi</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="container mx-auto py-8 px-4">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-10 w-full"
                  placeholder="Kişilerde ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button onClick={() => {
                  setSelectedContact(null);
                  setIsAddDialogOpen(true);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Kişi
                </Button>
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                    id="json-upload"
                  />
                  <label htmlFor="json-upload">
                    <Button variant="outline" className="cursor-pointer" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        İçe Aktar
                      </span>
                    </Button>
                  </label>
                </div>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Dışa Aktar
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[600px] rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30px]"></TableHead>
                    <TableHead>Ad Soyad</TableHead>
                    <TableHead>İletişim</TableHead>
                    <TableHead>Adres</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => contact.id && toggleFavorite(contact.id)}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              contact.favorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                            }`}
                          />
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            {contact.phone}
                          </div>
                          {contact.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              {contact.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {contact.address && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            {contact.address}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedContact(contact);
                            setIsAddDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedContact(contact);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <ContactForm
          onClose={() => setIsAddDialogOpen(false)}
          initialData={selectedContact || undefined}
          onSubmit={handleSubmit}
        />
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kişiyi Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu kişiyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}