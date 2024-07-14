import { environment } from './environments/environment';
import {widgetCfgData} from './config'

declare global {
    interface Window {
        sportpriority: {
            init(): void;
        };
    }
}

type widgetType = {
    id: string,
    iframe: HTMLIFrameElement;
}

if (!window.sportpriority) {
    class WidgetController {
        private isApp = widgetCfgData.isApp;
        private widgetHost = environment.widgetHost
        private widgets: widgetType[] = [];

        private createWidget = (element: HTMLDivElement): widgetType => {
            let url: string;
            let id: string;

            if(element.attributes.getNamedItem('data-from-app')) {
                this.isApp = true;
                id = environment.widgetIdInApp;
                const clubId = element.attributes.getNamedItem('data-club-id')?.value;
                url = `${this.widgetHost}?w=${id}&clubId=${clubId}`;
            }
            else {
                id = element.attributes.getNamedItem('data-sportpriority-widget-id')?.value!;
                url = `${this.widgetHost}?w=${id}`;
            }

            const iframe = document.createElement('iframe');

            iframe.src = url;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = '0';
            iframe.style.display = 'block';

            element.appendChild(iframe);

            const hostMessageListener = (event: MessageEvent) => {
                if (event.data.action === 'widget-modal-open') {
                    let iframe = document.getElementsByTagName('iframe')[0];
                    let link = event.data.route
                    iframe.src = link
                    console.log(link)
                }
            };

            window.addEventListener('message', hostMessageListener);

            return {id, iframe};
        }

        public init = () => {
            const widgetWrappers = document.querySelectorAll('[data-sportpriority-widget-id]');
            Array.prototype.forEach.call(widgetWrappers, wrapper => {
                const id = wrapper.attributes.getNamedItem('data-sportpriority-widget-id').value;
                const existingWidget = this.widgets.find(x => x.id === id)!;

                if (!existingWidget) {
                    const widget = this.createWidget(wrapper);
                    this.widgets.push(widget);
                } else {
                    if (!document.body.contains(existingWidget.iframe)) {
                        const widget = this.createWidget(wrapper);
                        const keys = Object.keys(widget)
                        keys.forEach((key ) => {
                            // @ts-ignore
                            existingWidget[key] = widget[key];
                        })
                    }
                }
            });
        }
    }
    window.sportpriority = new WidgetController();
}

window.sportpriority.init();

