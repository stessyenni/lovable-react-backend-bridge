import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Star, MessageSquare } from "lucide-react";
import { EmergencyContact } from "./EmergencyContactsManager";

interface EmergencyContactSelectorProps {
  open: boolean;
  onClose: () => void;
  contacts: EmergencyContact[];
  onSelectContact: (contact: EmergencyContact) => void;
  onSendSmsToAll?: () => void;
}

const EmergencyContactSelector = ({
  open,
  onClose,
  contacts,
  onSelectContact,
  onSendSmsToAll
}: EmergencyContactSelectorProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Phone className="h-5 w-5" />
            {t('emergency.selectContact')}
          </DialogTitle>
          <DialogDescription>
            {t('emergency.selectContactDesc')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-2 py-4">
          {contacts.map((contact) => (
            <Button
              key={contact.id}
              variant="outline"
              className={`w-full justify-start h-auto py-3 ${contact.is_primary ? 'border-primary' : ''}`}
              onClick={() => onSelectContact(contact)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{contact.name}</span>
                    {contact.is_primary && (
                      <Badge variant="default" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        {t('emergency.primary')}
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">{contact.phone}</span>
                  {contact.relationship && (
                    <span className="text-xs text-muted-foreground block">{contact.relationship}</span>
                  )}
                </div>
                <Phone className="h-4 w-4 text-destructive" />
              </div>
            </Button>
          ))}
        </div>

        {onSendSmsToAll && contacts.length > 0 && (
          <div className="border-t pt-4">
            <Button
              variant="destructive"
              className="w-full"
              onClick={onSendSmsToAll}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {t('emergency.sendSmsToAll')}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyContactSelector;
