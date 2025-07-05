#include <stdio.h>
int main(int argc, char const *argv[])
{
    int n = 1;
    int count = 0;
    int i = 1;
    int j = 1;
    while (n < 5)
    {

        if (count >=5)
        {
            for (i = 2; i <= 3; i++)
            {
                for (j = 1; j <= 3; j++)
                {
                    if (j == i)
                    {
                        printf("*");
                        count = count + 1;
                    }
                    else
                    {
                        printf(" ");
                    }
                }
                printf("\n");
            }
        }
        else
        {
            for (i = 1; i <= 3; i++)
            {
                for (j = 1; j <= 3; j++)
                {
                    if (j == i)
                    {
                        printf("*");
                        count = count + 1;
                    }
                    else
                    {
                        printf(" ");
                    }
                }
                printf("\n");
            }
        }

        // else if(i>3){
        for (i = 2; i > 0; i--)
        {
            for (j = 1; j <= 3; j++)
            {
                if (j == i)
                {
                    printf("*");
                    count = count + 1;
                }
                else
                {
                    printf(" ");
                }
            }
            printf("\n");
        }
        // }
        n++;
    }
    return 0;
}
