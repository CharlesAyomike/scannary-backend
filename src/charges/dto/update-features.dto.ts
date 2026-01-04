import { PartialType } from '@nestjs/mapped-types';
import { OmitType } from '@nestjs/swagger';
import { FeaturesDto } from './features.dto';

export class UpdateFeatureDto extends PartialType(
  OmitType(FeaturesDto, ['planId'] as const),
) {}
