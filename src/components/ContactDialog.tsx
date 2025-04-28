
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MessageSquare } from 'lucide-react';
import ContactForm from './ContactForm';
import { Button } from './ui/button';

const ContactDialog = ({ isMobile = false }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isMobile ? (
          <div className="px-4 py-2 hover:bg-gray-100 rounded-md">
            Contact Us
          </div>
        ) : (
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <ContactForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
