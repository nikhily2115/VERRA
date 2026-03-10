import { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: 'General',
      questions: [
        {
          question: 'What is VERRA?',
          answer: 'VERRA is a curated luxury marketplace connecting discerning collectors with verified vendors offering authentic, high-quality luxury goods including timepieces, jewelry, art, and accessories.'
        },
        {
          question: 'How do I create an account?',
          answer: 'Click the "Sign In" button in the navigation bar, then select "Register" to create your account. You\'ll need to provide your name, email, and create a secure password.'
        },
        {
          question: 'Is VERRA available internationally?',
          answer: 'Yes, we ship to select countries worldwide. Shipping availability and costs vary by location and will be calculated at checkout.'
        }
      ]
    },
    {
      category: 'Orders & Shipping',
      questions: [
        {
          question: 'How long does shipping take?',
          answer: 'Standard shipping typically takes 5-7 business days. Express shipping options are available at checkout for faster delivery. International orders may take 10-14 business days.'
        },
        {
          question: 'Can I track my order?',
          answer: 'Yes, once your order ships, you\'ll receive a tracking number via email. You can also view your order status in your account dashboard.'
        },
        {
          question: 'What are the shipping costs?',
          answer: 'Shipping costs vary based on item size, weight, and destination. All items include free standard shipping on orders over $500.'
        }
      ]
    },
    {
      category: 'Returns & Exchanges',
      questions: [
        {
          question: 'What is your return policy?',
          answer: 'We offer a 14-day return policy for most items. Items must be in original condition with all packaging and documentation. Some items may have different return policies due to their nature.'
        },
        {
          question: 'How do I initiate a return?',
          answer: 'Log into your account, go to your order history, and select the item you wish to return. Follow the prompts to generate a return label and instructions.'
        },
        {
          question: 'When will I receive my refund?',
          answer: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item. The refund will be credited to your original payment method.'
        }
      ]
    },
    {
      category: 'Authentication & Quality',
      questions: [
        {
          question: 'How do you verify authenticity?',
          answer: 'All vendors are thoroughly vetted, and items undergo rigorous authentication processes. We work with certified experts and require complete provenance documentation for all luxury items.'
        },
        {
          question: 'What if I receive a counterfeit item?',
          answer: 'We guarantee 100% authenticity. If you receive a counterfeit item, contact us immediately for a full refund and investigation. We take authenticity very seriously.'
        },
        {
          question: 'Do items come with certificates?',
          answer: 'Yes, applicable items include certificates of authenticity, original packaging, and documentation. Details are specified in each product listing.'
        }
      ]
    },
    {
      category: 'Payment & Security',
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept major credit cards (Visa, Mastercard, American Express), debit cards, and secure payment through Razorpay. All transactions are encrypted and secure.'
        },
        {
          question: 'Is my payment information secure?',
          answer: 'Yes, we use industry-standard encryption and secure payment processing through Razorpay. We never store your complete payment information on our servers.'
        },
        {
          question: 'Can I save items for later?',
          answer: 'Yes, you can add items to your wishlist by clicking the heart icon on any product. Your wishlist is saved to your account for easy access.'
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-playfair font-bold text-gold mb-6 tracking-wider">
            FAQ
          </h1>
          <p className="text-xl text-secondary max-w-3xl mx-auto leading-relaxed">
            Find answers to commonly asked questions
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-card rounded-2xl p-8 border border-border">
              <h2 className="text-2xl font-playfair font-bold text-primary mb-6">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const index = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openIndex === index;

                  return (
                    <div
                      key={questionIndex}
                      className="border border-border rounded-2xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between bg-background hover:bg-opacity-80 transition-colors"
                      >
                        <span className="text-left text-primary font-medium">
                          {faq.question}
                        </span>
                        <svg
                          className={`w-5 h-5 text-gold transition-transform ${
                            isOpen ? 'transform rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-6 py-4 bg-background border-t border-border">
                          <p className="text-secondary text-sm leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center bg-card rounded-2xl p-8 border border-border">
          <h3 className="text-xl font-playfair font-bold text-primary mb-3">
            Still have questions?
          </h3>
          <p className="text-secondary mb-6">
            Our customer support team is here to help
          </p>
          <a
            href="/contact"
            className="inline-block bg-gold hover:bg-opacity-90 text-background font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:scale-105"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
