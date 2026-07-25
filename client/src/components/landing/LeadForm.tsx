import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Send, Check, Command } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { leadService } from '../../services/leadService';
import { BUDGET_OPTIONS } from '../../types/lead';

const leadFormSchema = z.object({
  name: z.string().trim().min(3, 'Name must be at least 3 characters'),
  email: z.string().trim().email('Please enter a valid email address'),
  budget: z.enum(BUDGET_OPTIONS, { required_error: 'Please select a budget' }),
  message: z.string().trim().min(15, 'Message must be at least 15 characters'),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

const budgetOptions = BUDGET_OPTIONS.map((budget) => ({
  value: budget,
  label: budget,
}));

const MESSAGE_MIN = 15;

export const LeadForm = () => {
  const [justSubmitted, setJustSubmitted] = useState(false);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    mode: 'onTouched',
  });

  const { ref: nameRegisterRef, ...nameRegisterRest } = register('name');
  const messageValue = watch('message') ?? '';
  const messageCount = messageValue.trim().length;
  const messageReady = messageCount >= MESSAGE_MIN;

  const onSubmit = async (data: LeadFormValues) => {
    try {
      await leadService.createLead(data);
      reset();
      setJustSubmitted(true);
      toast.success('Thank you! Your lead has been submitted successfully.');
      setTimeout(() => setJustSubmitted(false), 2000);
      nameInputRef.current?.focus();
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string; errors?: Array<{ message: string }> } } };
      const message =
        axiosError.response?.data?.errors?.[0]?.message ||
        axiosError.response?.data?.message ||
        'Failed to submit lead. Please try again.';
      toast.error(message);
    }
  };

  const handleMessageKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(onSubmit)();
    }
  };

  const fields = [
    <Input
      key="name"
      label="Full Name"
      placeholder="John Doe"
      error={errors.name?.message}
      {...nameRegisterRest}
      ref={(el) => {
        nameRegisterRef(el);
        nameInputRef.current = el;
      }}
    />,
    <Input
      key="email"
      label="Email Address"
      type="email"
      placeholder="john@example.com"
      error={errors.email?.message}
      {...register('email')}
    />,
    <Select
      key="budget"
      label="Budget Range"
      placeholder="Select your budget"
      options={budgetOptions}
      error={errors.budget?.message}
      {...register('budget')}
    />,
  ];

  return (
    <section id="lead-form" className="scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="text-center animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Get In Touch
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Fill out the form below and we&apos;ll get back to you shortly.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-10 space-y-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-lg shadow-gray-200/60 transition-shadow duration-300 hover:shadow-xl animate-fade-in sm:p-10"
          noValidate
        >
          <fieldset disabled={isSubmitting} className="space-y-6 disabled:opacity-60">
            {fields.map((field, i) => (
              <div
                key={field.key}
                className="animate-fade-in"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}
              >
                {field}
              </div>
            ))}

            <div className="animate-fade-in" style={{ animationDelay: '180ms', animationFillMode: 'backwards' }}>
              <Textarea
                label="Message"
                placeholder="Tell us about your project..."
                rows={4}
                error={errors.message?.message}
                onKeyDown={handleMessageKeyDown}
                {...register('message')}
              />
              <div className="mt-1.5 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 text-gray-400">
                  <Command className="h-3 w-3" aria-hidden="true" />
                  Enter to submit
                </span>
                <span
                  className={messageReady ? 'inline-flex items-center gap-1 text-emerald-600' : 'text-gray-400'}
                  aria-live="polite"
                >
                  {messageReady && <Check className="h-3 w-3" aria-hidden="true" />}
                  {messageCount}/{MESSAGE_MIN}
                </span>
              </div>
            </div>
          </fieldset>

          <Button
            type="submit"
            size="lg"
            isLoading={isSubmitting}
            className="w-full transition-transform active:scale-[0.98]"
          >
            {justSubmitted ? (
              <>
                <Check className="h-4 w-4" aria-hidden="true" />
                Sent
              </>
            ) : (
              <>
                <Send className="h-4 w-4" aria-hidden="true" />
                Submit Lead
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
};