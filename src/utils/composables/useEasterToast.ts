import { onBeforeUnmount, onMounted } from 'vue';
import { useState, useToast } from '#imports';

type ToastItem = {
  img: string;
  title: string;
  description: string;
  color?: string;
  timeout?: number;
};

export function useEasterToast() {
  const toast = useToast();

  const items: ToastItem[] = [
    {
      img: '/icons/sr.png',
      title: '@SmileRime',
      description: 'Я прилетел из далекой страны, поэтому мне хочется спать',
      timeout: 1000,
    },
    {
      img: '/icons/lot.jpg',
      title: '@LOT',
      description: 'Сколько бы не было стараний я все равно остаюсь пидором',
      timeout: 1000,
    },
    {
      img: '/icons/sbebe.jpg',
      title: '@Sbebe',
      description: 'Хочу тяночку',
      timeout: 1000,
    },
  ];

  const cooling = useState<number>('easter-toast-cooldown', () => 0);

  onMounted(() => {
    const targetSeq = ['х', 'у', 'й'];
    let buffer: string[] = [];
    let lastTs = 0;
    const GAP_MS = 1500;

    const isTypingInField = (el: EventTarget | null) => {
      const n = el as HTMLElement | null;
      if (!n) return false;
      const tag = (n.tagName || '').toLowerCase();
      return tag === 'input' || tag === 'textarea' || (n as HTMLElement).isContentEditable === true;
    };

    const triggerToasts = () => {
      const now = Date.now();
      if (now - cooling.value < 2500) return; // анти-спам
      cooling.value = now;

      items.forEach((it, idx) => {
        setTimeout(() => {
          toast.add({
            title: it.title,
            description: it.description,
            avatar: { src: it.img },
            color: 'primary',
          });
        }, idx * 600);
      });
    };

    const onKey = (e: KeyboardEvent) => {
      if (isTypingInField(e.target)) return;

      const now = performance.now();
      if (now - lastTs > GAP_MS) buffer = [];
      lastTs = now;

      const k = e.key.toLowerCase();
      if (k.length === 1) {
        buffer.push(k);
        if (buffer.length > targetSeq.length) buffer.shift();
        const ok = targetSeq.every((ch, i) => buffer[i] === ch);
        if (ok) {
          triggerToasts();
          buffer = [];
        }
      }
    };

    window.addEventListener('keydown', onKey, { passive: true });
    onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
  });
}
