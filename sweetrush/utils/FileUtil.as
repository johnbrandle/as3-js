/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013 
 */

package sweetrush.utils
{
	import sweetrush.*;
	import flash.utils.ByteArray;

	CONFIG::air
	{
		import flash.filesystem.File;
		import flash.filesystem.FileStream;
		import flash.filesystem.FileMode;
		import flash.utils.ByteArray;
	}

	public class FileUtil
	{
		CONFIG::node
		{
			private static const fs = require('fs');
			private static const path = require('path');
		}

		public static function getBasePath()
		{
			CONFIG::node
			{
				return path.join(__dirname, '../../../', 'transcompiler');
			}
			CONFIG::air
			{
				return fixPath(Transcompiler.baseDir);
			}
		}

		public static function getExcludedPath()
		{
			CONFIG::node
			{
				return path.join(__dirname, '../../../', 'transcompiler', '_excluded');
			}
			CONFIG::air
			{
				return fixPath(new File(getBasePath()).resolvePath('_excluded').nativePath);
			}
		}

		public static function resolvePath(src, append)
		{
			CONFIG::node
			{
				return fixPath(path.join(src, append));
			}
			CONFIG::air
			{
				return fixPath(new File(src).resolvePath(append).nativePath);
			}
		}

		public static function read(file)
		{
			CONFIG::air
			{
				var fileStream = new FileStream();
				var file2:File = new File(file);
				fileStream.open(file2, FileMode.READ);
				var contents:String = fileStream.readUTFBytes(fileStream.bytesAvailable).replace(/^\uFEFF/, '');
				fileStream.close();
				return contents;
			}
			CONFIG::node
			{
				return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
			}
		}

		public static function write(file, contents)
		{
			CONFIG::air
			{
				var fileStream = new FileStream();
				var file2:File = new File(file);
				fileStream.open(file2, FileMode.WRITE);
				fileStream.writeUTFBytes(contents);
				fileStream.close();
			}
			CONFIG::node
			{
				fs.writeFileSync(file, contents, 'utf8');
			}
		}

		public static function readDirectory(directory)
		{
			CONFIG::air
			{
				var files:Array = [];
				var file:File = new File(directory);
				var contents:Array = file.getDirectoryListing();
				for (var i:uint = 0; i < contents.length; i++)
				{
					files.push(contents[i].nativePath);
				}
				return files;
			}

			CONFIG::node
			{
				var files:Array = fs.readdirSync(directory);
				for (var i:int = 0; i < files.length; i++) files[i] = directory + '/' + files[i];
				return files;
			}
		}

		public static function fixPath(path)
		{
			return path.split('\\\\').join('/').split('\\').join('/');
		}

		public static function exists(file)
		{
			CONFIG::air
			{
				var file2:File = new File(file);
				return file2.exists;
			}

			CONFIG::node
			{
				return fs.existsSync(file);
			}
		}

		public static function getList(path, recursive, filter)
		{
			var returnList = innerGetList(path, recursive, filter, path);
			returnList['basepath'] = fixPath(path);

			return returnList;

			function innerGetList(path, recursive, filter, basePath)
			{
				path = fixPath(path);
				basePath = fixPath(basePath);

				var file = new VFile(path);
				var list = file.listFiles();
				var returnList = new Array();

				for (var i = 0; i < list.length; i++)
				{
					file = list[i];

					var result = filter(file, basePath);
					if (result) returnList.push(result);

					if (file.isDirectory() && recursive)
					{
						var innerList = innerGetList(file.src, recursive, filter, basePath);
						returnList = returnList.concat(innerList);
					}
				}

				return returnList;
			}
		}

		public static function filterList(list, filter)
		{
			var returnList = [];
			returnList['basepath'] = list['basepath'];
			for (var i = 0; i < list.length; i++)
			{
				var file = filter(list[i], list['basepath']);
				if (!file) continue;

				returnList.push(file);
			}

			return returnList;
		}

		public static function getListFilter_none()
		{
			function filter(file, basePath)
			{
				return file;
			}

			return filter;
		}

		public static function getListFilter_hidden()
		{
			function filter(file, basePath)
			{
				return file;
			}

			return filter;
		}

		public static function getListFilter_extension(extension, include_)
		{
			extension = '.' + extension;

			function filter(file, basePath)
			{
				var result = file.src.slice(-extension.length);
				if (result == extension) return (include_) ? file : null;

				return (include_) ? null : file;
			}

			return filter;
		}

		public static function getListFilter_name(name, include_)
		{
			function filter(file, basePath)
			{
				var result = fixPath(file.src).split('/').pop();
				if (result == name)
				{
					return (include_) ? file : null;
				}

				return (include_) ? null : file;
			}

			return filter;
		}

		public static function getListFilter_directories()
		{
			function filter(file, basePath)
			{
				if (file.isDirectory()) return null;

				return file;
			}

			return filter;
		}

		public static function getListFilter_directory(path)
		{
			path = fixPath(path);

			function filter(file, basePath)
			{
				basePath = fixPath(basePath);

				if (fixPath(file.src).indexOf(path) == 0) return null;

				return file;
			}

			return filter;
		}

		public static function getListFilter_list(list)
		{
			function filter(file, basePath)
			{
				basePath = fixPath(basePath);

				var compare1 = fixPath(file.src).split(basePath)[1];
				for (var i = 0; i < list.length; i++)
				{
					var compare2 = fixPath(list[i].src).split(fixPath(list['basepath']))[1];

					if (compare1 == compare2) return null;
				}

				return file;
			}

			return filter;
		}

		public static function getListFilter_filters(filters)
		{
			function filter(file, basePath)
			{
				for (var i = 0; i < filters.length; i++)
				{
					var result = filters[i](file, basePath);

					if (!result) return null;
				}

				return file;
			}

			return filter;
		}
	}
}

CONFIG::air
{
	import flash.filesystem.File;
}

import sweetrush.utils.FileUtil;

internal class VFile
{
	CONFIG::node
	{
		private static const fs = require('fs');
		private static const path = require('path');
	}

	public var src:String;

	public function VFile(src)
	{
		CONFIG::node
		{
			this.src = FileUtil.fixPath(path.normalize(src));
		}

		CONFIG::air
		{
			var file = new flash.filesystem.File(src);
			file.canonicalize();
			this.src = FileUtil.fixPath(file.nativePath);
		}
	}

	public function listFiles()
	{
		function getFiles (dir, files_)
		{
			files_ = files_ || [];
			var files = FileUtil.readDirectory(dir);

			for (var i in files)
			{
				var name = files[i];
				if (new VFile(name).isDirectory()) getFiles(name, files_);
				else files_.push(new VFile(name));
			}
			return files_;
		}

		return getFiles(src, []);
	}

	public function getPath()
	{
		CONFIG::air
		{
			var file = new File(src);
			if (file.isDirectory) return src;
			else return FileUtil.fixPath(file.parent.nativePath);
		}

		CONFIG::node
		{
			return path.dirname(src).split('/').pop();
		}
	}

	public function getParent()
	{
		CONFIG::air
		{
			var file = new File(src);
			if (file.isDirectory) return FileUtil.fixPath(file.parent.nativePath);
			else return FileUtil.fixPath(file.parent.parent.nativePath);
		}

		CONFIG::node
		{
			return path.dirname(this.src).split('/').pop();
		}
	}

	public function isHidden()
	{
		return false;
	}

	public function equals(file)
	{
		return src == file.src;
	}

	public function isDirectory()
	{
		CONFIG::air
		{
			return new File(src).isDirectory;
		}

		CONFIG::node
		{
			return fs.statSync(src).isDirectory();
		}
	}

	public function toString()
	{
		return src;
	}
}
