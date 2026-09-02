import { officialEmailShell, sendOfficialEmail } from "@/lib/mail";
import { getBranding, getFleetById, markRentalEmailStatus } from "@/lib/db";
import type { RentalRequest, RentalStatus } from "@/lib/types";

const statusCopy: Record<RentalStatus, { title: string; intro: string }> = {
  pending: {
    title: "Booking request received",
    intro:
      "Thank you. We have received your machine booking request and our rental desk will follow up with you shortly.",
  },
  approved: {
    title: "Your booking has been approved",
    intro:
      "Good news — your hire request has been approved. Our team will confirm mobilisation details with you.",
  },
  active: {
    title: "Your machine is now on hire",
    intro:
      "The requested machine is now marked as active / on site. Please keep this email for your records.",
  },
  completed: {
    title: "Hire completed",
    intro:
      "This hire has been marked as completed. Thank you for working with us.",
  },
  rejected: {
    title: "Booking update",
    intro:
      "We were not able to confirm this hire as requested. Please reply or call us if you would like an alternative machine.",
  },
};

export async function sendBookingEmails(rental: RentalRequest) {
  const [branding, machine] = await Promise.all([
    getBranding(),
    getFleetById(rental.fleetId),
  ]);
  const machineName = machine?.name || "Equipment";
  const rows = [
    { label: "Reference", value: rental.id },
    { label: "Machine", value: machineName },
    { label: "Dates", value: `${rental.startDate} to ${rental.endDate}` },
    { label: "Site", value: rental.location },
    { label: "Client", value: rental.customerName },
    { label: "Phone", value: rental.customerPhone || "—" },
    { label: "Status", value: "Pending confirmation" },
  ];

  const client = officialEmailShell({
    company: branding.companyName,
    legalName: branding.legalName,
    title: "Official booking confirmation",
    intro: `Dear ${rental.customerName || "client"}, thank you for requesting ${machineName}. This is your official confirmation that we have received your booking details and will follow up.`,
    rows,
    footer:
      "This is not a final invoice. Hire rates are confirmed by our team after reviewing your project.",
    phone: branding.supportPhone,
    email: branding.supportEmail,
  });

  const clientStatus = await sendOfficialEmail({
    to: rental.customerEmail,
    subject: `${branding.companyName} — booking received (${machineName})`,
    html: client.html,
    text: client.text,
    kind: "booking_received",
    rentalId: rental.id,
  });
  await markRentalEmailStatus(rental.id, clientStatus);

  const desk = officialEmailShell({
    company: branding.companyName,
    legalName: branding.legalName,
    title: "New client booking",
    intro: `A client has submitted a new booking. Please follow up on phone and email.`,
    rows,
    footer: rental.notes ? `Client notes: ${rental.notes}` : "No extra notes.",
    phone: rental.customerPhone,
    email: rental.customerEmail,
  });

  await sendOfficialEmail({
    to: branding.supportEmail,
    subject: `New booking — ${machineName} — ${rental.customerName}`,
    html: desk.html,
    text: desk.text,
    kind: "booking_received",
    rentalId: rental.id,
  });

  return clientStatus;
}

export async function sendBookingStatusEmail(rental: RentalRequest) {
  const [branding, machine] = await Promise.all([
    getBranding(),
    getFleetById(rental.fleetId),
  ]);
  const copy = statusCopy[rental.status];
  const machineName = machine?.name || "Equipment";
  const body = officialEmailShell({
    company: branding.companyName,
    legalName: branding.legalName,
    title: copy.title,
    intro: `Dear ${rental.customerName || "client"}, ${copy.intro}`,
    rows: [
      { label: "Reference", value: rental.id },
      { label: "Machine", value: machineName },
      { label: "Dates", value: `${rental.startDate} to ${rental.endDate}` },
      { label: "Site", value: rental.location },
      { label: "Status", value: rental.status.toUpperCase() },
    ],
    footer: "Keep this official email for your project records.",
    phone: branding.supportPhone,
    email: branding.supportEmail,
  });

  return sendOfficialEmail({
    to: rental.customerEmail,
    subject: `${branding.companyName} — booking ${rental.status} (${machineName})`,
    html: body.html,
    text: body.text,
    kind: "booking_status",
    rentalId: rental.id,
  });
}
