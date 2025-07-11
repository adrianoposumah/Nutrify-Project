// Main components
export { default as Navbar } from './main/Navbar';
export { default as Footer } from './main/Footer';
export { default as ItemCard } from './main/ItemCard';
export { default as UserSidebar } from './main/UserSidebar';

// Feature components
export { default as BackgroundProvider } from './features/BackgroundProvider';
export { default as RecommendationFood } from './features/RecommendationFood';
export { default as ServiceWorkerRegistration } from './features/ServiceWorkerRegistration';

// UI components
export { Button, buttonVariants } from './ui/button';
export { Input } from './ui/input';
export { Label } from './ui/label';
export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent } from './ui/card';
export { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from './ui/sheet';
export { default as ThemeToggle } from './ui/ThemeToggle';
export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis } from './ui/breadcrumb';
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';
export { Badge, badgeVariants } from './ui/badge';
export { Skeleton } from './ui/skeleton';
export { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
export { Textarea } from './ui/textarea';
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';
export { Combobox } from './ui/combobox';
export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from './ui/dialog';

// View components
export { LoginForm } from './view/Auth/LoginForm';
export { RegisterForm } from './view/Auth/RegisterForm';
export { UserCard } from './view/User/UserCard';
export { UserNav } from './view/User/UserNav';
export { default as ShowItem } from './view/Item/ShowItem';
export { default as ItemForm } from './view/Item/ItemForm';
export { default as PendingItemList } from './view/Item/PendingItemList';
export { default as PendingItemDetail } from './view/Item/PendingItemDetail';
