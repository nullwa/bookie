import { Public } from "@/_app/decorators/public.decorator";

@Public()
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {
    
   }
