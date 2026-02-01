<?php

namespace app\Enums;

enum Ability: string
{
  case ADMIN = 'ADMIN';
  case BUSINESS_OWNER = 'BUSINESS_OWNER';
  case USER = 'USER';
  case CLIENT = 'CLIENT';
}