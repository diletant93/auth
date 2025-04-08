import Button from "../Button/Button";
import { Github, Headset } from 'lucide-react';
export default function OAuthButtons({ className }: Readonly<{ className?: string }>) {
    return (
        <div className={className}>
            <Button>
                <Github />
            </Button>
            <Button>
                <Headset />
            </Button>
        </div>
    );
}
