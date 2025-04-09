import Link from "next/link";

export default async function NotFound(){
    return (
        <div>
            <p className="text-xl text-red-400">Page was not found</p>
            <Link className="px-4 py-1 bg-amber-900 text-amber-300 rounded-xl" href={'/'}>Go back home</Link>
        </div>
    )
}