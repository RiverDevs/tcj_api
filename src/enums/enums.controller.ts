import { Controller, Get } from '@nestjs/common';
import { CategoryEnum } from '../common/enums/category.enum';
import { SubCategoryEnum } from '../common/enums/subcategory.enum';
import { RondaEnum } from '../common/enums/ronda.enum';
import { GrupoEnum } from '../common/enums/grupo.enum';
import { CantidadEnum } from 'src/common/enums/cantidad.enum';
import { ParejaEquiposEnum } from 'src/common/enums/parejaequipos.enum';
import { FasesEnum } from 'src/common/enums/fases.enum';

@Controller('enums')
export class EnumsController {
  @Get('categorias')
  getCategorias() {
    return Object.values(CategoryEnum);
  }

  @Get('subcategorias')
  getSubcategorias() {
    return Object.values(SubCategoryEnum);
  }

  @Get('rondas')
  getRondas() {
    return Object.values(RondaEnum);
  }

  @Get('grupos')
  getGrupos() {
    return Object.values(GrupoEnum);
  }

  @Get('cantidad')
  getCantidad() {
    return Object.values(CantidadEnum);
  }

  @Get('parejadeequipos')
  getParejaDeEquipos() {
    return Object.values(ParejaEquiposEnum);
  }
  @Get('fases')
  getFases() {
    return Object.values(FasesEnum);
  }
}
