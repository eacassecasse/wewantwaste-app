import { cn } from "../lib/utils";

const Card = ({ className, ...props }: React.ComponentProps<"div">) => {
    return (
        <div className={cn("bg-white flex flex-col rounded-2xl shadow-md px-4 py-6", className)} {...props} />
    );
}

const CardImage = ({ src, alt, className, ...props }: React.ComponentProps<"img">) => {
    return (
        <div className="w-full aspect-[4/3] rounded-lg bg-muted">
            <img className={cn("h-full object-cover rounded-lg", className)} src={src} alt={src} {...props} />
        </div>
    );
}

const CardContent = ({ className, ...props }: React.ComponentProps<"div">) => {
    return (
        <div className={cn("flex flex-col space-y-0.5", className)} {...props}>
        </div>
    );
}

const CardAction = ({ className, ...props }: React.ComponentProps<"div">) => {
    return (
        <div className={cn("flex flex-row flex-nowrap justify-between items-center", className)} {...props}>
        </div>
    );
}

export {
    Card,
    CardImage,
    CardContent,
    CardAction
}