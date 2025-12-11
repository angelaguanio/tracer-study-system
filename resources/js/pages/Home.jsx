import AppLayout from '../layouts/app-layout';
import ModeToggle from '../components/mode-toggle';

export default function Home() {
    return (
        <AppLayout>
            <div className="mx-auto flex min-h-screen w-full items-center justify-center">Home</div>
            <ModeToggle/>
        </AppLayout>
    );
}
