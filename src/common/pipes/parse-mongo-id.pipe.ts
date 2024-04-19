import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Valia si no es un mongo id valido.
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`${value} is not a valid MongoId`);
    }

    return value;
  }
}
