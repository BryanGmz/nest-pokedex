import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Pokemon extends Document {
    @Prop({
        // Definir que es unico
        unique: true,
        // Esta cloumna sera un indice para la busqueda
        index: true,
    })
    name: string;
    
    @Prop({
        unique: true,
        index: true,
    })
    no: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);