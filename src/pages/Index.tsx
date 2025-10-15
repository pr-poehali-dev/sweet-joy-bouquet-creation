import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Розовая нежность',
    price: 2500,
    image: 'https://cdn.poehali.dev/projects/daf5d2dd-c34c-43c5-aa03-0b001f22993e/files/09313eb5-36ff-48fb-bd8a-bc39b9a0fbec.jpg',
    description: 'Элегантный букет с розами и конфетами',
    category: 'Премиум'
  },
  {
    id: 2,
    name: 'Клубничная мечта',
    price: 3200,
    image: 'https://cdn.poehali.dev/projects/daf5d2dd-c34c-43c5-aa03-0b001f22993e/files/8a6ba2e0-a2ce-4da2-9019-bb36d7bc59b7.jpg',
    description: 'Букет с клубникой в шоколаде и макаронс',
    category: 'Эксклюзив'
  },
  {
    id: 3,
    name: 'Радужный праздник',
    price: 1800,
    image: 'https://cdn.poehali.dev/projects/daf5d2dd-c34c-43c5-aa03-0b001f22993e/files/d28b8cc1-9c13-4c6f-be7f-4d6950d09167.jpg',
    description: 'Яркий букет с леденцами и зефиром',
    category: 'Классик'
  }
];

const reviews = [
  { name: 'Анна', rating: 5, text: 'Потрясающий букет! Виновница торжества была в восторге!' },
  { name: 'Дмитрий', rating: 5, text: 'Быстрая доставка, все свежее и красиво упаковано' },
  { name: 'Мария', rating: 5, text: 'Заказываю уже третий раз - всегда высокое качество!' }
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeSection, setActiveSection] = useState('home');
  const { toast } = useToast();

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast({
      title: 'Добавлено в корзину',
      description: product.name
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">SWEET JOY</h1>
          <nav className="hidden md:flex gap-6">
            {['Главная', 'Каталог', 'Доставка', 'Отзывы', 'Контакты'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`story-link text-sm font-semibold ${
                  activeSection === item.toLowerCase() ? 'text-primary' : 'text-foreground'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="relative">
                <Icon name="ShoppingCart" size={20} />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-accent">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle className="text-2xl">Корзина</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {cart.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Корзина пуста</p>
                ) : (
                  <>
                    {cart.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                            <div className="flex-1">
                              <h4 className="font-semibold">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">{item.price}₽</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, -1)}>
                                  <Icon name="Minus" size={14} />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, 1)}>
                                  <Icon name="Plus" size={14} />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => removeFromCart(item.id)} className="ml-auto">
                                  <Icon name="Trash2" size={16} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Итого:</span>
                      <span>{cartTotal}₽</span>
                    </div>
                    <Button className="w-full" size="lg">
                      Оформить заказ
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <section id="главная" className="py-20 px-4 animate-fade-in">
        <div className="container mx-auto text-center">
          <div className="animate-float inline-block mb-6 text-6xl">🎁</div>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-primary">Sweet Joy</h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Сладкие букеты для ваших особенных моментов
          </p>
          <Button size="lg" onClick={() => scrollToSection('каталог')} className="animate-scale-in">
            Выбрать букет
          </Button>
        </div>
      </section>

      <section id="каталог" className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h3 className="text-4xl font-bold text-center mb-12 text-primary">Наши букеты</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Card key={product.id} className="overflow-hidden hover-scale animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xl font-bold">{product.name}</h4>
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">{product.price}₽</span>
                    <Button onClick={() => addToCart(product)}>
                      <Icon name="ShoppingCart" size={18} className="mr-2" />
                      В корзину
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="доставка" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-4xl font-bold text-center mb-12 text-primary">Доставка</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: 'Truck', title: 'Быстро', text: 'Доставка за 2 часа' },
              { icon: 'MapPin', title: 'По городу', text: 'Бесплатно от 3000₽' },
              { icon: 'Clock', title: 'Точно в срок', text: 'Доставка ко времени' }
            ].map((item, i) => (
              <Card key={i} className="text-center p-6 hover-scale">
                <div className="w-16 h-16 mx-auto mb-4 bg-secondary/20 rounded-full flex items-center justify-center">
                  <Icon name={item.icon as any} size={32} className="text-primary" />
                </div>
                <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                <p className="text-muted-foreground">{item.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="отзывы" className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-4xl font-bold text-center mb-12 text-primary">Отзывы</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <Card key={i} className="p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(review.rating)].map((_, j) => (
                    <Icon key={j} name="Star" size={16} className="fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{review.text}"</p>
                <p className="font-semibold">— {review.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="контакты" className="py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h3 className="text-4xl font-bold mb-8 text-primary">Контакты</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Icon name="Phone" className="text-primary" />
              <span className="text-lg">+7 (999) 123-45-67</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Icon name="Mail" className="text-primary" />
              <span className="text-lg">info@sweetjoy.ru</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Icon name="MapPin" className="text-primary" />
              <span className="text-lg">г. Москва, ул. Праздничная, 15</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-lg font-semibold mb-2">SWEET JOY</p>
          <p className="text-sm opacity-90">Сладкие букеты с любовью © 2025</p>
        </div>
      </footer>
    </div>
  );
}
