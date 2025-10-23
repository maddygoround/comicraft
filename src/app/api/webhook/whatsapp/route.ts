import { NextRequest, NextResponse } from 'next/server';

// WhatsApp Webhook verification and message handling
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    // Verify the webhook
    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        console.log('WhatsApp webhook verified');
        return new NextResponse(challenge, { status: 200 });
    } else {
        console.log('WhatsApp webhook verification failed');
        return new NextResponse('Forbidden', { status: 403 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Handle WhatsApp messages
        if (body.object === 'whatsapp_business_account') {
            const entry = body.entry?.[0];
            const changes = entry?.changes?.[0];

            if (changes?.field === 'messages') {
                const messages = changes.value?.messages;

                if (messages && messages.length > 0) {
                    for (const message of messages) {
                        await handleWhatsAppMessage(message);
                    }
                }
            }
        }

        return new NextResponse('OK', { status: 200 });
    } catch (error) {
        console.error('WhatsApp webhook error:', error);
        return new NextResponse('Error', { status: 500 });
    }
}

async function handleWhatsAppMessage(message: any) {
    const { from, type, text } = message;

    if (type === 'text' && text?.body) {
        const userMessage = text.body.toLowerCase();

        // Simple command handling
        if (userMessage.includes('comic') || userMessage.includes('story')) {
            // Send a response with a link to the comic creator
            await sendWhatsAppMessage(from, {
                type: 'text',
                text: {
                    body: `🎨 Welcome to ComicGenius! 

Create amazing comics from your stories with AI:

📝 Write your story
👥 Add character photos  
🎨 Choose your style
✨ Generate your comic

Visit: ${process.env.NEXT_PUBLIC_APP_URL || 'https://comicgenius.vercel.app'}

Type "help" for more commands.`
                }
            });
        } else if (userMessage.includes('help')) {
            await sendWhatsAppMessage(from, {
                type: 'text',
                text: {
                    body: `🤖 ComicGenius Commands:

• "comic" or "story" - Get started
• "help" - Show this help
• "about" - Learn more about ComicGenius

Visit our web app to create your comic!`
                }
            });
        } else if (userMessage.includes('about')) {
            await sendWhatsAppMessage(from, {
                type: 'text',
                text: {
                    body: `🎭 About ComicGenius:

ComicGenius uses AI to transform your stories into beautiful comics. Simply write your story, add character photos, choose a style, and watch as AI creates your comic panels!

Features:
✨ AI-powered character generation
🎨 Multiple comic styles
📱 Mobile-optimized interface
🚀 Fast and easy to use

Start creating: ${process.env.NEXT_PUBLIC_APP_URL || 'https://comicgenius.vercel.app'}`
                }
            });
        }
    }
}

async function sendWhatsAppMessage(to: string, message: any) {
    // This would integrate with WhatsApp Business API
    // For now, just log the message
    console.log(`Sending WhatsApp message to ${to}:`, message);

    // In a real implementation, you would:
    // 1. Get access token from WhatsApp Business API
    // 2. Send HTTP request to WhatsApp API
    // 3. Handle responses and errors
}
