import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'طقم JustQueen الرياضي المميز',
    price: 350,
    description: 'طقم ملابس رياضية فاخر عالي الأداء مصمم للتمارين المكثفة وأوقات الراحة. يتميز بجاكيت بسحاب وبنطلون ضيق بخصر عالٍ، مصنوع من نسيج فائق النعومة يتمدد في أربعة اتجاهات ليتحرك معك.',
    category: 'ملابس رياضية',
    image: '/IMG_5584.jpg',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { 
        name: 'وردي فاتح', 
        hex: '#FFB6C1', 
        image: '/IMG_5584.jpg' 
      },
      { 
        name: 'أخضر حكيم', 
        hex: '#9CAF88', 
        image: '/IMG_5590.jpg' 
      },
      { 
        name: 'أزرق سماوي', 
        hex: '#87CEEB', 
        image: '/IMG_5587.jpg' 
      },
      { 
        name: 'أخضر فاتح', 
        hex: '#CCFF00', 
        image: '/IMG_5586.jpg' 
      },
      { 
        name: 'أصفر فاتح', 
        hex: '#FFF44F', 
        image: '/IMG_5585.jpg' 
      }
    ]
  }
];
