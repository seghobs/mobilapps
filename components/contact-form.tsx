"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ContactSchema, type Contact } from "@/lib/db";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ContactFormProps {
  onClose: () => void;
  initialData?: Contact;
  onSubmit: (data: Contact) => void;
}

export function ContactForm({ onClose, initialData, onSubmit }: ContactFormProps) {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<Contact>({
    resolver: zodResolver(ContactSchema),
    defaultValues: initialData || {
      name: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
      favorite: false,
    },
  });

  const onSubmitForm = async (data: Contact) => {
    try {
      await onSubmit(data);
      toast({
        title: "Başarılı",
        description: `Kişi başarıyla ${initialData ? 'güncellendi' : 'kaydedildi'}.`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Hata",
        description: "Bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{initialData ? 'Kişiyi Düzenle' : 'Yeni Kişi Ekle'}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Ad Soyad</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input id="phone" {...register("phone")} />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-posta</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Adres</Label>
          <Textarea id="address" {...register("address")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notlar</Label>
          <Textarea id="notes" {...register("notes")} />
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="favorite" {...register("favorite")} />
          <Label htmlFor="favorite">Favorilere Ekle</Label>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button type="submit">
            {initialData ? 'Güncelle' : 'Kaydet'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}