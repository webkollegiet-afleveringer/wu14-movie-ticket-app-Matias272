export default function validatePayment(payment) {
  if (!payment) return "Payment info is required";

  const name = (payment.name || "").trim();
  const email = (payment.email || "").trim();
  const cardNumber = String(payment.cardNumber || "").replace(/\s/g, "");
  const expiry = String(payment.expiry || "").trim();
  const cvv = String(payment.cvv || "").trim();

  if (!name) return "Name is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email";
  if (!/^\d{16}$/.test(cardNumber)) return "Card number must be 16 digits";
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) return "Expiry must use MM/YY";
  if (!/^\d{3,4}$/.test(cvv)) return "CVV must be 3 or 4 digits";

  return null;
}
