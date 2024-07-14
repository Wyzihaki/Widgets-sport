import Gallery from "@/app/_components/gallery/Gallery";
import Cabinet from "@/app/_components/Cabinet";
import {weekData} from "@/utils/funcs";
import {widgetCfgData} from "@/config";

export default async function Home() {
    const {data, error} = await weekData(widgetCfgData.city, widgetCfgData.net, widgetCfgData.club)
    return (
        <div>
            {
                widgetCfgData.isApp
                ?
                    <Cabinet clubs={data}/>
                :
                    <Gallery data={data}/>

            }
        </div>
    );
}
