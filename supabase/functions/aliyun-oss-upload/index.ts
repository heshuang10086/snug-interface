
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HmacSHA1, enc } from "https://deno.land/x/crypto@v0.10.1/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const {
      filename,
      contentType,
      size
    } = await req.json()

    const accessKeyId = Deno.env.get('ALIYUN_OSS_ACCESS_KEY_ID')!
    const accessKeySecret = Deno.env.get('ALIYUN_OSS_ACCESS_KEY_SECRET')!
    const bucket = Deno.env.get('ALIYUN_OSS_BUCKET')!
    const region = Deno.env.get('ALIYUN_OSS_REGION')!

    // Generate a unique object name
    const objectName = `videos/${Date.now()}-${filename}`
    const host = `https://${bucket}.${region}.aliyuncs.com`
    const expiration = new Date(Date.now() + 3600000).toISOString() // 1 hour
    
    // Policy for direct upload
    const policy = {
      expiration,
      conditions: [
        ["content-length-range", 0, 5368709120], // 5GB max
        ["eq", "$key", objectName],
        ["eq", "$Content-Type", contentType],
      ],
    }

    const policyString = btoa(JSON.stringify(policy))
    const signature = enc.Base64.stringify(
      HmacSHA1(policyString, accessKeySecret)
    )

    const response = {
      uploadUrl: host,
      formData: {
        key: objectName,
        policy: policyString,
        OSSAccessKeyId: accessKeyId,
        success_action_status: '200',
        signature: signature,
        'Content-Type': contentType,
      },
      fileUrl: `${host}/${objectName}`
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
