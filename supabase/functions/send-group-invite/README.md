# Send Group Invite Edge Function

This Edge Function sends group invitation emails using Resend.

## Configuration

1. Set up your Resend API key in Supabase:
```bash
supabase secrets set RESEND_API_KEY=re_123...
```

2. Deploy the function:
```bash
supabase functions deploy send-group-invite
```

## Environment Variables

- `RESEND_API_KEY`: Your Resend API key

## Usage

The function expects a POST request with the following JSON body:
```json
{
  "email": "recipient@example.com",
  "groupName": "Family Gift Exchange",
  "inviteCode": "abc123..."
}
```
