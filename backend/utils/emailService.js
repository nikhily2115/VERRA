const nodemailer = require('nodemailer');
const logger = require('./logger');

// Email configuration
const createTransporter = () => {
  // For development, we'll use Gmail SMTP
  // In production, you should use a proper email service like SendGrid, AWS SES, etc.
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

// Send contact form email
const sendContactEmail = async (contactData) => {
  const { name, email, subject, message, referenceId } = contactData;
  
  // Always log the contact form submission to console for immediate visibility
  console.log('\n' + '='.repeat(80));
  console.log('🔔 NEW CONTACT FORM SUBMISSION');
  console.log('='.repeat(80));
  console.log(`📧 From: ${name} <${email}>`);
  console.log(`📋 Subject: ${subject}`);
  console.log(`🆔 Reference ID: ${referenceId}`);
  console.log(`⏰ Time: ${new Date().toLocaleString()}`);
  console.log('📝 Message:');
  console.log('-'.repeat(40));
  console.log(message);
  console.log('-'.repeat(40));
  console.log(`📞 Reply to: ${email}`);
  console.log('='.repeat(80) + '\n');

  // Check if email credentials are properly configured
  const emailConfigured = process.env.EMAIL_PASS && 
                          process.env.EMAIL_PASS !== 'your-gmail-app-password-here' &&
                          process.env.EMAIL_USER && 
                          process.env.EMAIL_USER !== 'your-email@gmail.com';

  if (!emailConfigured) {
    logger.warn('Email not configured - using console notification only', {
      name, email, subject, referenceId
    });
    
    return {
      success: false,
      message: 'Email not configured - contact logged to console',
      error: 'Gmail App Password not set up'
    };
  }

  try {
    const transporter = createTransporter();
    
    // Email to admin (your email)
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'nikhily2115@gmail.com',
      subject: `VERRA Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #C6A75E, #D4B876); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">VERRA - New Contact Message</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Contact Form Submission</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #C6A75E; margin-top: 0;">Customer Details</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Reference ID:</strong> ${referenceId}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #C6A75E; margin-top: 0;">Message</h3>
              <p style="line-height: 1.6; color: #333;">${message}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e8f4f8; border-radius: 8px;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                <strong>Submitted:</strong> ${new Date().toLocaleString()}<br>
                <strong>Reply to:</strong> ${email}
              </p>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">This email was sent from the VERRA contact form</p>
          </div>
        </div>
      `
    };

    // Confirmation email to customer
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting VERRA - We\'ve received your message',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #C6A75E, #D4B876); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">VERRA</h1>
            <p style="color: white; margin: 5px 0 0 0;">Luxury E-Commerce</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Thank you for contacting us, ${name}!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              We have received your message and will get back to you within 24 hours. 
              Our team is committed to providing you with the best possible service.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #C6A75E; margin-top: 0;">Your Message Summary</h3>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Reference ID:</strong> ${referenceId}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div style="background: #C6A75E; color: white; padding: 15px; border-radius: 8px; text-align: center;">
              <p style="margin: 0; font-weight: bold;">Need immediate assistance?</p>
              <p style="margin: 5px 0 0 0;">Call us at +91 7021551912</p>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">VERRA - Timeless Elegance | Visit us at verra.com</p>
          </div>
        </div>
      `
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(customerMailOptions);

    logger.info('Contact emails sent successfully', {
      to: 'nikhily2115@gmail.com',
      customer: email,
      subject,
      referenceId
    });

    console.log('✅ EMAIL SENT SUCCESSFULLY to nikhily2115@gmail.com');

    return {
      success: true,
      message: 'Emails sent successfully'
    };

  } catch (error) {
    logger.error('Failed to send contact email', {
      error: error.message,
      stack: error.stack,
      name, email, subject, referenceId
    });

    console.log('❌ EMAIL FAILED - But contact form submission logged above');
    console.log(`Error: ${error.message}`);

    // Don't throw error - we still want to save the contact form
    return {
      success: false,
      message: 'Email sending failed - contact logged to console',
      error: error.message
    };
  }
};

module.exports = {
  sendContactEmail
};