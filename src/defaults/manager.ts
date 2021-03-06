import { Token } from '@phosphor/coreutils';
import { ISettingRegistry } from '@jupyterlab/coreutils';
import { IStatusBar } from '../statusBar';
import { JupyterLab, JupyterLabPlugin } from '@jupyterlab/application';
import { STATUSBAR_PLUGIN_ID } from '..';
import { SetExt } from '../util/set';
import { Widget } from '@phosphor/widgets';
import { Signal } from '@phosphor/signaling';
import { IDisposable } from '@phosphor/disposable';
import { SignalExt } from '../util/signal';

export interface IDefaultsManager {
    addDefaultStatus(
        id: string,
        widget: Widget,
        opts: IStatusBar.IItemOptions
    ): void;
}

export namespace IDefaultsManager {
    export interface IItem {
        id: string;
        item: Widget;
        opts: IStatusBar.IItemOptions;
    }
}

// tslint:disable-next-line:variable-name
export const IDefaultsManager = new Token<IDefaultsManager>(
    'jupyterlab-statusbar/IDefaultStatusesManager'
);

class DefaultsManager implements IDefaultsManager, IDisposable {
    constructor(opts: DefaultsManager.IOptions) {
        this._settings = opts.settings;
        this._statusBar = opts.statusBar;

        this._settings
            .load(STATUSBAR_PLUGIN_ID)
            .then(settings => {
                settings.changed.connect(this._onSettingsUpdated);

                this._onSettingsUpdated(settings);
            })
            .catch((reason: Error) => {
                console.error(reason.message);
            });
    }

    addDefaultStatus(
        id: string,
        item: Widget,
        opts: IStatusBar.IItemOptions
    ): void {
        // Combine settings and provided isActive function
        if (opts.isActive === undefined) {
            opts.isActive = () => {
                return this._enabledStatusIds.has(id);
            };
        } else {
            const prevIsActive = opts.isActive;
            opts.isActive = () => {
                return prevIsActive() && this._enabledStatusIds.has(id);
            };
        }

        // Combine stateChanged of settings with provided stateChanged
        const stateChanged: Signal<Widget, void> = new Signal(item);
        if (opts.stateChanged === undefined) {
            opts.stateChanged = stateChanged;
        } else {
            opts.stateChanged = SignalExt.combine(
                this,
                opts.stateChanged,
                stateChanged
            );
        }

        const defaultItem = {
            id,
            item,
            opts,
            stateChanged
        };

        this._statusBar.registerStatusItem(id, item, opts);
        this._allDefaultStatusItems.set(id, defaultItem);
    }

    get isDisposed() {
        return this._isDisposed;
    }

    dispose() {
        if (this.isDisposed) {
            return;
        }

        Signal.clearData(this);
        this._isDisposed = true;
    }

    private _onSettingsUpdated = (settings: ISettingRegistry.ISettings) => {
        let rawEnabledItems = settings.get('enabledDefaultItems').composite as
            | string[]
            | null;

        if (rawEnabledItems === null) {
            rawEnabledItems = settings.default(
                'enabledDefaultItems'
            ) as string[];
        }

        let newEnabledItems = new Set(rawEnabledItems);

        let idsToRemove = SetExt.difference(
            this._enabledStatusIds,
            newEnabledItems
        );

        let idsToAdd = SetExt.difference(
            newEnabledItems,
            this._enabledStatusIds
        );

        SetExt.deleteAll(this._enabledStatusIds, [...idsToRemove]);
        SetExt.addAll(this._enabledStatusIds, [...idsToAdd]);

        [...idsToAdd, ...idsToRemove].forEach(val => {
            const statusItem = this._allDefaultStatusItems.get(val);
            if (statusItem !== undefined) {
                statusItem.stateChanged.emit(void 0);
            }
        });
    };

    private _allDefaultStatusItems: Map<
        string,
        DefaultsManager.IItem
    > = new Map();
    private _enabledStatusIds: Set<string> = new Set();
    private _isDisposed: boolean = false;

    private _settings: ISettingRegistry;
    private _statusBar: IStatusBar;
}

namespace DefaultsManager {
    export interface IOptions {
        settings: ISettingRegistry;
        statusBar: IStatusBar;
    }

    export interface IItem extends IDefaultsManager.IItem {
        stateChanged: Signal<any, void>;
    }
}

/**
 * Initialization data for the statusbar extension.
 */
export const defaultsManager: JupyterLabPlugin<IDefaultsManager> = {
    id: 'jupyterlab-statusbar/defaults-manager',
    provides: IDefaultsManager,
    autoStart: true,
    requires: [ISettingRegistry, IStatusBar],
    activate: (
        _app: JupyterLab,
        settings: ISettingRegistry,
        statusBar: IStatusBar
    ) => {
        return new DefaultsManager({ settings, statusBar });
    }
};
