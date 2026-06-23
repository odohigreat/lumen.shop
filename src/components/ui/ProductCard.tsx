import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Product } from '../../types';
import { formatCurrency, cn } from '../../utils';

interface ProductCardProps {
  product: Product;
  className?: string;
  index?: number;
}

export function ProductCard({ product, className, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <Link to={`/product/${product.id}`} className={cn("group flex flex-col gap-4", className)}>
        <div className="relative aspect-[3/4] bg-secondary overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {product.images[1] && (
            <img 
              src={product.images[1]} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out opacity-0 group-hover:opacity-100"
            />
          )}
        </div>
        <div className="flex flex-col items-center text-center">
          <h3 className="font-medium text-sm tracking-wide">{product.name}</h3>
          <p className="text-muted text-sm mt-1">{formatCurrency(product.price)}</p>
        </div>
      </Link>
    </motion.div>
  );
}
