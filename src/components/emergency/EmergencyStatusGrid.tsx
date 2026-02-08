import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

type EmergencyStatusGridProps = {
  contactsCount: number;
  emergencyMode: boolean;
};

const EmergencyStatusGrid = ({ contactsCount, emergencyMode }: EmergencyStatusGridProps) => {
  const { t } = useTranslation();

  const items = [
    {
      label: t("emergency.personalContacts"),
      badgeText: `${contactsCount} ${t("emergency.saved")}`,
      badgeVariant: "secondary" as const,
    },
    {
      label: t("emergency.locationServices"),
      badgeText: t("emergency.enabled"),
      badgeVariant: "secondary" as const,
    },
    {
      label: t("emergency.medicalData"),
      badgeText: t("emergency.complete"),
      badgeVariant: "secondary" as const,
    },
    {
      label: t("emergency.emergencyMode"),
      badgeText: emergencyMode ? t("emergency.active") : t("emergency.inactive"),
      badgeVariant: emergencyMode ? ("destructive" as const) : ("outline" as const),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between gap-3 p-3 bg-muted/50 rounded-lg min-w-0"
        >
          <span className="text-xs sm:text-sm text-muted-foreground truncate">{item.label}</span>
          <Badge variant={item.badgeVariant} className="flex-shrink-0 w-fit text-xs">
            {item.badgeText}
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default EmergencyStatusGrid;
