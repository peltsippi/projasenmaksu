Chrome plugin to calculate union membership fee

Makes it easier to calculate certain % of monthly earnings including maximum membership limit.

Changelog:

31.12.	Barcode: copy barcode to clipboard

29.12.	First tests passed, virtual barcode creation works within its own bubble.

26.12.	Started testing with virtual barcode creation

23.12. 	Settings work and rate & max sum can be set and stored to personal plugin settings

19.12.	Separated icons for different sizes

?.? 	First version

Notes to self:
Now just needed to figure out how barcode creation could be incorporated to the whole mess.
TODO also: clean the barcode code!

Possible UI:

*********
Settings:
*********

[XXXXXXXXXXXXXXXXXXXXXXXX] Reference 1 (fixed)	[xx.xx.xx] Due
[XXXXXXXXXXXXXXXXXXXXXXXX] Reference 2 (fixed)	[xx.xx.xx] Due
[XXXXXXXXXXXXXXXXXXXXXXXX] Reference 3 (fixed)	[xx.xx.xx] Due
[XXXXXXXXXXXXXXXXXXXXXXXX] Reference 4 (fixed)	[xx.xx.xx] Due
[XXXXXXXXXXXXXXXXXXXXXXXX] Reference 5 (fixed)	[xx.xx.xx] Due
[XXXXXXXXXXXXXXXXXXXXXXXX] Reference 6 (fixed)	[xx.xx.xx] Due
[XXXXXXXXXXXXXXXXXXXXXXXX] Reference 7 (fixed)	[xx.xx.xx] Due
[XXXXXXXXXXXXXXXXXXXXXXXX] Reference 8 (fixed)	[xx.xx.xx] Due
[XXXXXXXXXXXXXXXXXXXXXXXX] Reference 9 (fixed)	[xx.xx.xx] Due
[XXXXXXXXXXXXXXXXXXXXXXXX] Reference 10 (fixed)	[xx.xx.xx] Due
[XXXXXXXXXXXXXXXXXXXXXXXX] Reference 11 (fixed)	[xx.xx.xx] Due
[XXXXXXXXXXXXXXXXXXXXXXXX] Reference 12 (fixed)	[xx.xx.xx] Due

[FIxxxxxxxxxxxxxxxxxxx] account number (fixed)

[xx.xx€] max fee
[x.xx%] rate

[SAVE]		[RESET TO DEFAULTS]

buttons just store stuff to chrome extension sync place and reset reverts to default values for max fee & rate(?!?)

*********
Main ui:
*********

[XXXXXXXXXXXXXXXXXxx] Reference 1	[xx.xx.xx] Due	[MARK PAID] [UNDO]

[xx.xx.xx] wanted date
[xx.xx€] salary

zz.zz€ (actual sum)

[CREATE BARCODE]		[CLEAR FIELDS]

(max fee, account # and payment rate fetched to plugin to be vievable)


***************
Main ui functions:
***************
Mark paid -> store +1 value to reference field that should be fetched to UI and used
So first reference is ref 1, press mark paid and ref 2 appears, press and ref 3 appears etc

Undo -> store -1 value to references field

create barcode -> check that date is not later than due date, make sure salary has been changed from default and if not, nag. When everything checks out, copy barcode to clipboard and print it out.

Clear fields -> clear wanted date & salary.
