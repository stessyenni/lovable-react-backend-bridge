import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Plus, Edit2, Save, X, Trash2, Star } from "lucide-react";

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string | null;
  is_primary: boolean;
}

interface EmergencyContactsManagerProps {
  onContactsChange?: (contacts: EmergencyContact[]) => void;
}

const EmergencyContactsManager = ({ onContactsChange }: EmergencyContactsManagerProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", relationship: "" });

  useEffect(() => {
    if (user?.id) {
      fetchContacts();
    }
  }, [user?.id]);

  const fetchContacts = async () => {
    if (!user?.id) return;
    
    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', user.id)
      .order('is_primary', { ascending: false });
    
    if (data) {
      setContacts(data);
      onContactsChange?.(data);
    }
  };

  const handleSave = async () => {
    if (!user?.id || !formData.name.trim() || !formData.phone.trim()) {
      toast({
        title: t('emergency.error'),
        description: t('emergency.fillBothFields'),
        variant: "destructive"
      });
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from('emergency_contacts')
        .update({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          relationship: formData.relationship.trim() || null
        })
        .eq('id', editingId);

      if (error) {
        toast({ title: t('emergency.error'), description: t('emergency.saveFailed'), variant: "destructive" });
        return;
      }
    } else {
      const isPrimary = contacts.length === 0;
      const { error } = await supabase
        .from('emergency_contacts')
        .insert({
          user_id: user.id,
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          relationship: formData.relationship.trim() || null,
          is_primary: isPrimary
        });

      if (error) {
        toast({ title: t('emergency.error'), description: t('emergency.saveFailed'), variant: "destructive" });
        return;
      }
    }

    setFormData({ name: "", phone: "", relationship: "" });
    setIsAdding(false);
    setEditingId(null);
    fetchContacts();
    toast({ title: t('emergency.saved'), description: t('emergency.contactSaved') });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('emergency_contacts')
      .delete()
      .eq('id', id);

    if (!error) {
      fetchContacts();
      toast({ title: t('emergency.deleted'), description: t('emergency.contactDeleted') });
    }
  };

  const handleSetPrimary = async (id: string) => {
    if (!user?.id) return;
    
    // First, unset all as primary
    await supabase
      .from('emergency_contacts')
      .update({ is_primary: false })
      .eq('user_id', user.id);
    
    // Then set the selected one as primary
    await supabase
      .from('emergency_contacts')
      .update({ is_primary: true })
      .eq('id', id);
    
    fetchContacts();
  };

  const startEdit = (contact: EmergencyContact) => {
    setFormData({ name: contact.name, phone: contact.phone, relationship: contact.relationship || "" });
    setEditingId(contact.id);
    setIsAdding(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          {t('emergency.myEmergencyContacts')}
        </CardTitle>
        <CardDescription>{t('emergency.manageContacts')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {contacts.map((contact) => (
          <div key={contact.id} className={`flex items-center justify-between p-3 border rounded-lg ${contact.is_primary ? 'border-primary bg-primary/5' : ''}`}>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{contact.name}</p>
                {contact.is_primary && (
                  <Badge variant="default" className="text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    {t('emergency.primary')}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{contact.phone}</p>
              {contact.relationship && (
                <p className="text-xs text-muted-foreground">{contact.relationship}</p>
              )}
            </div>
            <div className="flex items-center gap-1">
              {!contact.is_primary && (
                <Button size="sm" variant="ghost" onClick={() => handleSetPrimary(contact.id)} title={t('emergency.setPrimary')}>
                  <Star className="h-4 w-4" />
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => startEdit(contact)}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(contact.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {isAdding ? (
          <div className="space-y-3 p-3 border-2 border-dashed rounded-lg">
            <div className="space-y-2">
              <Label>{t('emergency.contactName')}</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('emergency.enterContactName')}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('emergency.contactNumber')}</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={t('emergency.enterContactNumber')}
                type="tel"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('emergency.relationship')}</Label>
              <Input
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                placeholder={t('emergency.relationshipPlaceholder')}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>
                <Save className="h-3 w-3 mr-1" />
                {t('emergency.save')}
              </Button>
              <Button size="sm" variant="outline" onClick={() => { setIsAdding(false); setEditingId(null); setFormData({ name: "", phone: "", relationship: "" }); }}>
                <X className="h-3 w-3 mr-1" />
                {t('emergency.cancel')}
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" className="w-full" onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t('emergency.addContact')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmergencyContactsManager;
