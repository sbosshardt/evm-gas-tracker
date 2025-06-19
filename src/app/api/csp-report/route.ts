import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const report = await request.json();
    
    // Log CSP violations to your preferred logging service
    console.log('CSP Violation:', {
      blockedUri: report['csp-report']?.['blocked-uri'],
      violatedDirective: report['csp-report']?.['violated-directive'],
      documentUri: report['csp-report']?.['document-uri'],
      originalPolicy: report['csp-report']?.['original-policy'],
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing CSP report:', error);
    return NextResponse.json({ error: 'Failed to process report' }, { status: 500 });
  }
} 