import { fromApiLocale } from '@app/core/http/api-locale.mapper';
import type { HintModel } from '../../domain/models/hint.model';
import { isHintType } from '../../domain/values/hint-type';
import type { HintResponseDto } from '../api/hint-response.dto';
export function toHint(dto: HintResponseDto): HintModel {
  if (!isHintType(dto.type)) {
    throw new Error('Unsupported hint type');
  }
  return {
    ...dto,
    type: dto.type,
    info: dto.info.map((info) => ({ ...info, language: fromApiLocale(info.language) })),
  };
}
