import { Data } from "../types/types";

export function formatData(data: Data[]) {
    return data.map((data: Data) => ({
        id: data._id,
        type: data.type,
        createdAt: (new Date(data.updatedAt as string).getTime()),
        source: data.source,
        value: data.content,
        isFavorite: data.favorite
    }))
}