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

#pragma once
#include "p_exp.h"
#include "expression.h"
#include "graphics_context.h"

namespace whelk {
	class Null :
		public Expression
	{
	public:
		// we have a value so we can use the same copyfrom macro for all types.
		void* value;
		Null(void);
		~Null(void);
		virtual Delta draw(GraphicsContext *gc);
		int getHeight(GraphicsContext *grcon);
		int getWidth(GraphicsContext *grcon);
		virtual sPointer<Expression> newobj();
	};
};
