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

#include "bitmap.h"
#include "storage_allocator.h"

using namespace whelk;

Bitmap::Bitmap()
{
}

Bitmap::~Bitmap()
{
	for (int x = 0 ; x < w ; x++) {
		delete [] buffer[x];
	}
	delete [] buffer;
}

Bitmap::Bitmap(const Bitmap& rhs)
{
	init(rhs.w, rhs.h);
	for (int x = 0 ; x < w ; x++) {
		for (int y = 0 ; y < h ; y++) {
			buffer[x][y] = rhs.buffer[x][y];
		}
	}
}

Bitmap& Bitmap::operator=(const Bitmap& rhs)
{
	init(rhs.w, rhs.h);
	for (int x = 0 ; x < w ; x++) {
		for (int y = 0 ; y < h ; y++) {
			buffer[x][y] = rhs.buffer[x][y];
		}
	}
	return *this;
}

void Bitmap::init(int _w, int _h)
{
	if (_w < 1 || _h < 1) return;
	w = _w;
	h = _h;
	buffer = new int*[w];
	for (int x = 0 ; x < w ; x++) {
		buffer[x] = new int[h];
	}

}
void Bitmap::fill(int color)
{
	for (int x = 0 ; x < w ; x++) {
		for (int y = 0 ; y < h ; y++) {
			buffer[x][y] = color;
		}
	}
}

int Bitmap::getWidth()
{
	return w;
}
int Bitmap::getHeight()
{
	return h;
}

int **Bitmap::getBuffer()
{
	return buffer;
}


int Bitmap::getColorAt(int x, int y)
{
	return buffer[x][y];
}

int Bitmap::getc_R(int x) {
	return (((x)&0xFF000000)>>24);
}

int Bitmap::getc_G(int x) {
	return (((x)&0x00FF0000)>>16);
}
int Bitmap::getc_B(int x) {
	return (((x)&0x0000FF00)>>8);
}
int Bitmap::getc_A(int x) {
	return ((x)&0x000000FF);
}
int Bitmap::c_RGBA(int r, int g, int b, int a) {
       return ((((r)&0x000000FF)<<24)|(((g)&0x000000FF)<<16)|(((b)&0x000000FF)<<8)|((a)&0x000000FF));
}

