import { oAuthSignIn } from "@/app/_actions/oAuthActions";
import Button from "../Button/Button";
import { Github, Headset } from 'lucide-react';
export default function OAuthButtons({ className }: Readonly<{ className?: string }>) {
    async function handleGithub(){
        await oAuthSignIn('github')
    }
    async function handleDiscord(){
        await oAuthSignIn('discord')
    }
    return (
        <div className={className}>
            <Button onClick={handleGithub}>
                <Github />
            </Button>
            <Button onClick={handleDiscord}>
                <Headset />
            </Button>
        </div>
    );
}
