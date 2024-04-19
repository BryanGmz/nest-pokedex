import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    // Inyeccion de dependencias para modelos
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    
    try {
      // Insertar en la base de datos 
      const podemon = await this.pokemonModel.create(createPokemonDto);
      return podemon;
    } catch (error) {
      this.hanldeExceptions(error)
    } 
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    // by No. 
    if(!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({
        // Condiciones de busqueda se pueden adjuntar más
        no: term
      });
    }

    // by Mongo ID
    if(!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // by Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        // Condiciones de busqueda se pueden adjuntar más
        name: term.toLocaleLowerCase().trim(),
      });
    }

    if (!pokemon) throw new NotFoundException(`Pokemon with id, name or no ${term} not found`);
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      // Insertar en la base de datos 
      const pokemon = await this.findOne(term);
      if (updatePokemonDto.name) {
        updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
      }

      await pokemon.updateOne(updatePokemonDto);
    
      return {
        ...pokemon.toJSON(),
        ...updatePokemonDto,
      };
    } catch (error) {
      this.hanldeExceptions(error)
    } 
  }

  async remove(id: string) {
    // Busca por ID, y elimina el pokemon.
    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});
    if (deletedCount === 0) {
      throw new BadRequestException(`POokemon with id ${id} not found`);
    }

    return;
  }

  // Manejoador de errores
  private hanldeExceptions(error: any) {
    if(error.code === 11000) {
      throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`);
    }
    throw new InternalServerErrorException(`Can not update pokemon`);
  }
}
