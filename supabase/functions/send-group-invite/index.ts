import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'npm:resend'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
const APP_URL = Deno.env.get('APP_URL') || 'http://localhost:5173'  // Update this with your actual domain

serve(async (req) => {
  try {
    const { email, groupName, inviteCode } = await req.json()

    const { data, error } = await resend.emails.send({
      from: 'Giftify <onboarding@resend.dev>', // Update this with your verified domain
      to: email,
      subject: `You've been invited to join ${groupName} on Giftify!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">You've been invited to join a gift group!</h2>
          <p>You've been invited to join <strong>${groupName}</strong> on Giftify.</p>
          <p>Click the button below to accept the invitation:</p>
          <a href="${APP_URL}/invite/${inviteCode}" 
             style="display: inline-block; background-color: #2563eb; color: white; 
                    padding: 12px 24px; text-decoration: none; border-radius: 6px; 
                    margin: 16px 0;">
            Accept Invitation
          </a>
          <p style="color: #666;">This invite will expire in 7 days.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 0.875rem;">
            If you didn't request this invitation, you can safely ignore this email.
          </p>
        </div>
      `
    })

    if (error) {
      throw error
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
