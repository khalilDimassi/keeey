type EventMap = {
    [key: string]: (...args: any[]) => void;
};

class EventEmitter<T extends EventMap> {
    private listeners: {
        [K in keyof T]?: T[K][];
    } = {};

    on<K extends keyof T>(event: K, listener: T[K]): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event]?.push(listener);
    }

    off<K extends keyof T>(event: K, listener: T[K]): void {
        if (!this.listeners[event]) return;
        const index = this.listeners[event]?.indexOf(listener);
        if (index !== undefined && index !== -1) {
            this.listeners[event]?.splice(index, 1);
        }
    }

    emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void {
        this.listeners[event]?.forEach((listener) => listener(...args));
    }
}

type AppEvents = {
    refreshSuggestions: () => void;
    refreshStarredCandidates: () => void;
};

export const emitter = new EventEmitter<AppEvents>();