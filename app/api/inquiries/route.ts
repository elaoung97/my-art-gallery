import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import nodemailer from 'nodemailer';

export interface Order {
  id: string;
  artworkId: string;
  artworkTitle: string;
  price: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  shippingAddress: string;
  message: string;
  date: string;
  status: 'Pending' | 'Contacted' | 'Completed';
}

const dataDir = path.join(process.cwd(), 'data');
const ordersPath = path.join(dataDir, 'orders.json');

async function getOrders(): Promise<Order[]> {
  try {
    const content = await fs.readFile(ordersPath, 'utf-8');
    return JSON.parse(content);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(ordersPath, '[]', 'utf-8');
    return [];
  }
}

export async function GET() {
  const orders = await getOrders();
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orders = await getOrders();

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      artworkId: body.artworkId || '',
      artworkTitle: body.artworkTitle || 'Untitled Painting',
      price: Number(body.price) || 0,
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      clientPhone: body.clientPhone || '',
      shippingAddress: body.shippingAddress || '',
      message: body.message || '',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };

    // 1. Always save the order to the database first!
    const updated = [newOrder, ...orders];
    await fs.writeFile(ordersPath, JSON.stringify(updated, null, 2), 'utf-8');

    // 2. Attempt to send email
    const artistEmail = process.env.ARTIST_EMAIL;
    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (artistEmail && smtpEmail && smtpPassword) {
      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // Use SSL
          auth: {
            user: smtpEmail.trim(),
            pass: smtpPassword.replace(/\s+/g, ''), // Remove any accidental spaces
          },
        });

        await transporter.sendMail({
          from: `"Maison d'Acrylique" <${smtpEmail}>`,
          to: artistEmail,
          replyTo: newOrder.clientEmail,
          subject: `🎨 NEW ORDER: "${newOrder.artworkTitle}" from ${newOrder.clientName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
              <h2 style="color: #1e3a8a; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">
                New Artwork Order Received
              </h2>
              
              <h3 style="color: #334155; margin-top: 16px;">Artwork Details</h3>
              <p><strong>Piece:</strong> ${newOrder.artworkTitle}</p>
              <p><strong>Value:</strong> $${newOrder.price.toLocaleString()}</p>
              
              <h3 style="color: #334155; margin-top: 24px;">Client Contact Information</h3>
              <p><strong>Name:</strong> ${newOrder.clientName}</p>
              <p><strong>Email:</strong> <a href="mailto:${newOrder.clientEmail}">${newOrder.clientEmail}</a></p>
              <p><strong>Phone / WhatsApp:</strong> ${newOrder.clientPhone || 'Not provided'}</p>
              <p><strong>Delivery City / Country:</strong> ${newOrder.shippingAddress || 'Not provided'}</p>
              
              <h3 style="color: #334155; margin-top: 24px;">Note from Client</h3>
              <blockquote style="background: #ffffff; padding: 12px; border-left: 4px solid #3b82f6; margin: 0; color: #475569;">
                ${newOrder.message || 'No additional note provided.'}
              </blockquote>
            </div>
          `,
        });

        console.log('✅ Email notification successfully sent to:', artistEmail);
      } catch (mailError: any) {
        // Detailed error logged in your terminal so you can fix credentials without breaking the site
        console.error('❌ EMAIL ERROR DETAILS:', mailError.message);
      }
    } else {
      console.warn('⚠️ Email credentials missing in .env. Order saved to dashboard only.');
    }

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    console.error('Error saving order:', error);
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 });
  }
}