// Copyright 2003-2005, 2008, Jason Scherer
// Copyright 2019 Google, Inc.
/*
This file is part of Vodka.

Vodka is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Vodka is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Vodka.  If not, see <https://www.gnu.org/licenses/>.
*/

#include "symbol.h"
#include "storage_manager.h"
#include <string>

using namespace whelk;
using namespace std;

Symbol::Symbol()
{
	type = XT_SYMBOL;
	setMytext("_");
}

Symbol::~Symbol()
{
}

Symbol::Symbol(string x)
{
	type = XT_SYMBOL;
	setMytext(x);
}
