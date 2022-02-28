import FeaturedProjects from '../Pad/components/FeaturedProjects'

export default function PadCard() {
    const featuredListOptions = {
        'bgCard': '#06111C',
        'width': '250px',
        'titleFontSize': '18px',
        'descFontSize': '12px',
        'center': true
    }

    return (
        <div className="flex flex-col flex-1 rounded-2xl bg-[#001926] p-4">
            <div className="mb-4 text-[24px] font-medium">OrbitPad</div>
            <FeaturedProjects options={featuredListOptions} />
        </div>
    )
}