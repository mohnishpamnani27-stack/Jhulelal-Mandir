import TempleHistory from '@/components/TempleHistory';
import { varunDevtaBiography } from '@/lib/history';

export const metadata = {
  title: 'वरुण देवता की जीवनी | श्री झूलेलाल अखण्ड ज्योति ट्रस्ट',
  description:
    'भगवान झूलेलाल (वरुण देवता) का जीवन परिचय, जल और ज्योति की पूजा, और सिंधी समाज में उनका महत्व।',
};

export default function VarunDevtaPage() {
  return (
    <TempleHistory
      biography={varunDevtaBiography}
      closingMessage="वरुण देवता आज भी भक्तों के हृदय में निरन्तर वास करते हैं"
    />
  );
}
