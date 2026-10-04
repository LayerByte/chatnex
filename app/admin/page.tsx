import {redirect} from 'next/navigation';import {isAdmin} from '@/lib/auth/auth';import AdminDashboard from '@/components/admin/AdminDashboard';
export default async function AdminPage(){if(!await isAdmin())redirect('/admin/login');return <AdminDashboard/>}
