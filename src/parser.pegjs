{
  const RIGHT_BRACE = String.fromCharCode(125);
  const BACKTICK = String.fromCharCode(96);
}


start
  = parser_version_identifier _ NEX:nex _ { return NEX; }
  ;

parser_version_identifier
  = 'v2:'
  ;

nex
 = atom
 / list
 ;

list
 = org_list
 / exp_list
 / lambda_list
 / cmd_list
 / instance_list
 ;

instance_list
 = INST_NAME:instance_name PRIVATE:private_data_section '(_' TAGLIST:taglist? CHILDREN:(nex_with_space *) _ '_)' { return PF.makeInstanceList(INST_NAME, CHILDREN, PRIVATE, TAGLIST, 'h'); }
 / INST_NAME:instance_name PRIVATE:private_data_section '(|' TAGLIST:taglist? CHILDREN:(nex_with_space *) _ '|)' { return PF.makeInstanceList(INST_NAME, CHILDREN, PRIVATE, TAGLIST, 'v'); }
 ;

org_list
 = PRIVATE:private_data_section '(_' TAGLIST:taglist? CHILDREN:(nex_with_space *) _  '_)' { return PF.makeOrgList(CHILDREN, PRIVATE, TAGLIST, 'h'); }
 / PRIVATE:private_data_section '(|' TAGLIST:taglist? CHILDREN:(nex_with_space *) _  '|)' { return PF.makeOrgList(CHILDREN, PRIVATE, TAGLIST, 'v'); }
 ;

exp_list
 = '*' PRIVATE:private_data_section '(_' TAGLIST:taglist? CHILDREN:(nex_with_space *) _  '_)' { return PF.makeExpList(CHILDREN, PRIVATE, TAGLIST, 'h'); }
 / '*' PRIVATE:private_data_section '(|' TAGLIST:taglist? CHILDREN:(nex_with_space *) _  '|)' { return PF.makeExpList(CHILDREN, PRIVATE, TAGLIST, 'v'); }
 ;

lambda_list
 = '&' PRIVATE:private_data_section '(_' TAGLIST:taglist? CHILDREN:(nex_with_space *) _  '_)' { return PF.makeLambdaList(CHILDREN, PRIVATE, TAGLIST, 'h'); }
 / '&' PRIVATE:private_data_section '(|' TAGLIST:taglist? CHILDREN:(nex_with_space *) _  '|)' { return PF.makeLambdaList(CHILDREN, PRIVATE, TAGLIST, 'v'); }
 ;

cmd_list
 = '~' PRIVATE:private_data_section '(_' TAGLIST:taglist? CHILDREN:(nex_with_space *) _  '_)' { return PF.makeCommandList(null, CHILDREN, PRIVATE, TAGLIST, 'h'); }
 / '~' PRIVATE:private_data_section '(|' TAGLIST:taglist? CHILDREN:(nex_with_space *) _  '|)' { return PF.makeCommandList(null, CHILDREN, PRIVATE, TAGLIST, 'v'); }
 / '~' PRIVATE:private_data_section '(_' TAGLIST:taglist? NAME:cmd_name ( ws + ) CHILDREN:(nex_with_space *) _  '_)' { return PF.makeCommandList(NAME, CHILDREN, PRIVATE, TAGLIST, 'h'); }
 / '~' PRIVATE:private_data_section '(|' TAGLIST:taglist? NAME:cmd_name ( ws + ) CHILDREN:(nex_with_space *) _  '|)' { return PF.makeCommandList(NAME, CHILDREN, PRIVATE, TAGLIST, 'v'); }
 ;

cmd_name
 = [a-zA-Z0-9:-]*
 ;

children_in_parens
 = '(' CHILDREN:(nex_with_space *) _  ')' { return CHILDREN; }
 ;

nex_with_space
 = _ NEX:nex { return NEX; }

atom
  = boolean_expression
  / symbol_expression
  / integer_expression
  / string_expression
  / error_expression
  / float_expression
  / nil_expression
  / instance_atom
  ;

instance_atom
 = INST_NAME:instance_name PRIVATE:private_data_section TAGLIST:taglist? ! '(' { return PF.makeInstanceAtom(INST_NAME, PRIVATE, TAGLIST); }
 ;

instance_name
 = '[' INST_NAME_DATA:instance_name_data ']' { return INST_NAME_DATA; }
 ;

instance_name_data
 = [a-zA-Z0-9]*
 ;

boolean_expression
  = '!' TAGLIST:taglist? 'yes' { return PF.makeBool(true, TAGLIST); }
  / '!' TAGLIST:taglist? 'no'  { return PF.makeBool(false, TAGLIST); }
  ;

symbol_expression
  = '@' TAGLIST:taglist? SYMBOL:(symbol_char)+  { return PF.makeSymbol(SYMBOL, TAGLIST); }
  ;

symbol_char
  = SYMBOL_CHAR:[a-zA-Z0-9:-] { return SYMBOL_CHAR; }
  / '_' ! ')'                { return '_'; }
  ;

integer_expression
  = '#' TAGLIST:taglist? NEGATION:'-'? DIGITS:[0-9]+ { return PF.makeInteger(NEGATION, DIGITS, TAGLIST); }
  ;

string_expression
  = '$' TAGLIST:taglist?  DATA:private_data_section { return PF.makeString(DATA, TAGLIST); }
  ;

error_expression
  = '?' TAGLIST:taglist?   DATA:private_data_section { return PF.makeError(DATA, TAGLIST); }
  ;

float_expression
  = '%' TAGLIST:taglist?  FLOAT:float_digits { return PF.makeFloat(FLOAT, TAGLIST); }
  ;

nil_expression
  = '^' TAGLIST:taglist? { return PF.makeNil(TAGLIST) }
  ;

float_digits
  = INT_PART:integer_part DEC_PART:( '.' DEC_DIGITS:decimal_part {return DEC_DIGITS; } ) ?
      { return  DEC_PART ? (INT_PART + '.' + DEC_PART) : INT_PART} 
  / '.' DEC_DIGITS:decimal_part { return '0.' + DEC_DIGITS; }
  ;

integer_part
  = DIGITS:( [0-9] + ) { return DIGITS.join(''); }
  / '-' DIGITS:( [0-9] + ) { return '-' + DIGITS.join(''); }
  ;

decimal_part
  = DIGITS:( [0-9] + ) { return DIGITS.join(''); }
  ;

taglist
  = '<' TAGS:(tagwithspace *) _ '>' { return TAGS; }
  ;

tagwithspace
  = _ TAG:tag { return TAG; }
  ;

tag
  = '`' TAG_DATA:[^`]* '`' { return TAG_DATA; }
  ;

private_data_section
  = '"' DATA:[^"]* '"' { return DATA; }
  / '{' DATA:escaped_private_data '}' { return DATA; }
  / '' { return null; }
  ;

escaped_private_data
  = ( private_data_item * )
  ;

private_data_item
  = CHAR:[^|}] { return CHAR; }
  / '|}' { return RIGHT_BRACE; }
  / '||' { return '|'; }
  ;

_
 = ws*
 ;

ws
 = [ \r\n\t]
