import { Card, CardImage, CardContent, CardAction } from "../../../components/card";
import { Button } from "../../../components/ui/button";
import { cn } from "../../../lib/utils";

export interface SkipProps {
    id: number;
    size: string;
    hire_period_days: number;
    transport_cost: number | null;
    per_tonne_cost: number | null;
    price_before_vat: number;
    vat: number;
    postcode: string;
    area: string;
    forbidden: boolean;
    created_at: string;
    updated_at: string;
    allowed_on_road: boolean;
    allows_heavy_waste: boolean;
    image_url?: string;
}

const SkipCard = ({ skip, isSelected, onClick }: { skip: SkipProps, isSelected: boolean, onClick: () => void }) => {
    const totalPrice = skip.price_before_vat + (skip.price_before_vat * (skip.vat / 100));

    return (
        <Card className={cn("shadow-md hover:shadow-lg duration-300 rounded-lg px-2 py-4 md:shadow-2xl cursor-pointer transition-all border border-gray-200",
            isSelected ? "ring-2 ring-primary border-primary" : "hover:border-gray-300"
        )}>
            <CardImage
                src={skip.image_url || '/images/skip-placeholder.jpg'}
                alt={`${skip.size} skip`}
                className="hover:scale-105 transition-transform"
            />
            <CardContent className="px-4 py-3">
                <div className="flex justify-between items-center">
                    <h1 className='text-2xl font-bold text-gray-900'>{skip.size} Yards</h1>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${skip.allowed_on_road
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {skip.allowed_on_road ? "Road Allowed" : "Private Only"}
                    </span>
                </div>
                <div className="mt-2 space-y-1">
                    <p className='text-sm text-gray-600'>
                        <span className="font-medium">{skip.hire_period_days} days hire</span>
                    </p>
                    <p className='text-sm text-gray-600'>
                        {skip.area ? (
                            <>
                                <span className="font-medium">Common in </span>{skip.area}
                            </>
                        ) : "Available in all areas"}
                    </p>
                </div>
            </CardContent>
            <CardAction className="px-4 py-3 border-t border-gray-100">
                <div className="flex flex-row flex-nowrap justify-between items-center space-x-1">
                    <p className='text-lg font-bold text-gray-900'>
                        £{(totalPrice).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        incl. VAT
                    </p>
                </div>
                <Button className="w-32 text-foreground" onClick={onClick} variant="default">
                    {isSelected ? "Selected" : "Select"}
                </Button>
            </CardAction>
        </Card>
    );
}

export default SkipCard;
