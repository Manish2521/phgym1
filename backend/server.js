import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(cors({ origin: '*' }))
app.use(express.json())

// ── MongoDB ──────────────────────────────────────────────────────────────
let dbConnected = false
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => { dbConnected = true; console.log('✅ MongoDB connected') })
    .catch(err => console.log('⚠️  MongoDB skipped:', err.message))
}

const Contact = mongoose.model('Contact', new mongoose.Schema({
  firstName:  String,
  lastName:   String,
  phone:      { type: String, required: true },
  email:      { type: String, required: true },
  studio:     String,
  program:    String,
  message:    String,
  source:     { type: String, default: 'website' },
  createdAt:  { type: Date, default: Date.now }
}))

// ── Email ────────────────────────────────────────────────────────────────
const mailer = process.env.EMAIL_USER ? nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
}) : null

// ── POST /api/contact ────────────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  try {
    const { firstName, lastName, phone, email, studio, program, message } = req.body
    if (!phone || !email) return res.status(400).json({ error: 'Phone and email are required' })

    // 1. Save to MongoDB
    if (dbConnected) {
      await new Contact({ firstName, lastName, phone, email, studio, program, message }).save()
      console.log('✅ Saved to DB:', email)
    }

    // 2. Email notification to gym
    if (mailer && process.env.EMAIL_TO) {
      await mailer.sendMail({
        from: `"Powerhouse Gym Website" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: `🏋️ New Trial Request — ${firstName || ''} ${lastName || ''} | ${phone}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#080808;padding:24px;text-align:center;border-radius:8px 8px 0 0">
              <span style="font-size:26px;font-weight:900;color:#fff;letter-spacing:3px">POWERHOUSE</span>
              <div style="color:#D4FF00;font-size:12px;letter-spacing:4px;margin-top:4px">GYM &amp; SPA</div>
            </div>
            <div style="background:#f9f9f9;padding:24px;border-radius:0 0 8px 8px">
              <h2 style="color:#111;margin:0 0 20px">New Callback Request</h2>
              <table style="width:100%;border-collapse:collapse;font-size:14px">
                <tr><td style="padding:10px 12px;background:#fff;border-bottom:1px solid #eee;color:#666;width:130px;font-weight:600">Name</td><td style="padding:10px 12px;background:#fff;border-bottom:1px solid #eee">${firstName || ''} ${lastName || ''}</td></tr>
                <tr><td style="padding:10px 12px;background:#f5f5f5;border-bottom:1px solid #eee;color:#666;font-weight:600">Phone</td><td style="padding:10px 12px;background:#f5f5f5;border-bottom:1px solid #eee"><a href="tel:${phone}" style="color:#D4FF00;font-weight:700;text-decoration:none">${phone}</a></td></tr>
                <tr><td style="padding:10px 12px;background:#fff;border-bottom:1px solid #eee;color:#666;font-weight:600">Email</td><td style="padding:10px 12px;background:#fff;border-bottom:1px solid #eee"><a href="mailto:${email}" style="color:#555">${email}</a></td></tr>
                <tr><td style="padding:10px 12px;background:#f5f5f5;border-bottom:1px solid #eee;color:#666;font-weight:600">Studio</td><td style="padding:10px 12px;background:#f5f5f5;border-bottom:1px solid #eee">${studio || '—'}</td></tr>
                <tr><td style="padding:10px 12px;background:#fff;border-bottom:1px solid #eee;color:#666;font-weight:600">Program</td><td style="padding:10px 12px;background:#fff;border-bottom:1px solid #eee">${program || '—'}</td></tr>
                <tr><td style="padding:10px 12px;background:#f5f5f5;color:#666;font-weight:600">Message</td><td style="padding:10px 12px;background:#f5f5f5">${message || '—'}</td></tr>
              </table>
              <div style="margin-top:20px;text-align:center">
                <a href="tel:${phone}" style="background:#D4FF00;color:#000;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:900;font-size:14px;letter-spacing:1px;display:inline-block">📞 CALL NOW</a>
              </div>
              <p style="color:#aaa;font-size:11px;text-align:center;margin-top:16px">Received: ${new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})}</p>
            </div>
          </div>`
      })
      console.log('✅ Email sent to', process.env.EMAIL_TO)
    }

    // 3. Auto-reply to user
    if (mailer && email) {
      await mailer.sendMail({
        from: `"Powerhouse Gym & Spa" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Thanks ${firstName || 'there'}! We'll call you soon 💪`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#080808;padding:32px;text-align:center;border-radius:8px 8px 0 0">
              <span style="font-size:28px;font-weight:900;color:#fff;letter-spacing:3px">POWERHOUSE</span>
              <div style="color:#D4FF00;font-size:12px;letter-spacing:4px;margin-top:4px">GYM &amp; SPA</div>
            </div>
            <div style="background:#fff;padding:32px;border-radius:0 0 8px 8px">
              <h2 style="color:#111">Hey ${firstName || 'there'}! 👋</h2>
              <p style="color:#555;line-height:1.7;margin:16px 0">Thanks for reaching out to <strong>Powerhouse Gym &amp; Spa</strong>! We've received your request and our team will call you back within <strong>24 hours</strong>.</p>
              <div style="background:#f9f9f9;border-left:4px solid #D4FF00;padding:16px 20px;border-radius:4px;margin:20px 0">
                <p style="margin:0;color:#333;font-weight:600">📍 Spain House, C92, near Amul Dairy</p>
                <p style="margin:4px 0 0;color:#666">Madangir Village, New Delhi – 110062</p>
                <p style="margin:8px 0 0;color:#333;font-weight:600">⏰ Mon–Sat: 6AM–10:30PM | Sun: 12PM–4PM</p>
                <p style="margin:8px 0 0;color:#333;font-weight:600">📞 <a href="tel:+918800134969" style="color:#D4FF00">+91 88001 34969</a></p>
              </div>
              <p style="color:#555;line-height:1.7">Can't wait? Call us directly or WhatsApp us anytime!</p>
              <div style="text-align:center;margin-top:24px">
                <a href="https://wa.me/918800134969" style="background:#25D366;color:#fff;padding:14px 28px;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block;margin-right:10px">WhatsApp Us</a>
                <a href="tel:+918800134969" style="background:#D4FF00;color:#000;padding:14px 28px;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block">Call Us</a>
              </div>
              <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
              <p style="color:#aaa;font-size:12px;text-align:center">Follow us on Instagram: <a href="https://instagram.com/powerhousegymandspa" style="color:#D4FF00">@powerhousegymandspa</a></p>
            </div>
          </div>`
      })
      console.log('✅ Auto-reply sent to', email)
    }

    res.json({ success: true, message: 'Submitted successfully' })
  } catch (err) {
    console.error('Error:', err.message)
    res.status(500).json({ error: 'Server error. Please call +91 88001 34969' })
  }
})

app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date() }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`))
